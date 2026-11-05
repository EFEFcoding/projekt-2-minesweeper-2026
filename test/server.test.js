"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const http = require("node:http");
const { once } = require("node:events");
const { lavServer } = require("../server.js");
async function start(t, datafil) {
  if (!datafil) datafil = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "minesweeper-test-")), "spillere.json");
  const server = lavServer(datafil);
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(function () { server.closeAllConnections(); server.close(); });
  const base = "http://127.0.0.1:" + server.address().port;
  async function post(sti, data) {
    return fetch(base + sti, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
  }
  return { server, base, post, datafil };
}

test("forside, CSS, JavaScript serveres; private filer er utilgængelige", async function (t) {
  const s = await start(t);
  for (const sti of ["/", "/stil.css", "/spil.js", "/app.js", "/favicon.svg"]) {
    const svar = await fetch(s.base + sti);
    assert.equal(svar.status, 200, sti);
    assert.equal(svar.headers.get("x-content-type-options"), "nosniff");
    assert.ok((await svar.arrayBuffer()).byteLength > 0);
  }
  for (const sti of ["/data/spillere.json", "/server.js", "/package.json", "/../server.js", "/ukendt"]) {
    assert.equal((await fetch(s.base + sti)).status, 404, sti);
  }
});

test("ny spiller registreres med dansk navn og genfindes efter servergenstart", async function (t) {
  const s = await start(t);
  const svar = await s.post("/api/spillere", { navn: "  Søren Øster  " });
  assert.equal(svar.status, 201);
  const spiller = await svar.json();
  assert.equal(spiller.navn, "Søren Øster");
  assert.deepEqual(spiller.rekorder, []);
  s.server.closeAllConnections();
  await new Promise(function (resolve) { s.server.close(resolve); });
  const s2 = await start(t, s.datafil);
  const spillere = await (await fetch(s2.base + "/api/spillere")).json();
  assert.equal(spillere.length, 1);
  assert.equal(spillere[0].id, spiller.id);
});

test("ugyldige navne afvises, og et eksisterende navn vælger samme spiller", async function (t) {
  const s = await start(t);
  for (const navn of ["", " ", "a".repeat(25), "Hej\nDu"]) {
    assert.equal((await s.post("/api/spillere", { navn })).status, 400);
  }
  const ny = await s.post("/api/spillere", { navn: "Ægir" });
  assert.equal(ny.status, 201);
  const foerste = await ny.json();
  const eksisterende = await s.post("/api/spillere", { navn: "ægir" });
  assert.equal(eksisterende.status, 200);
  assert.equal((await eksisterende.json()).id, foerste.id);
  assert.equal((await (await fetch(s.base + "/api/spillere")).json()).length, 1);
});

test("præcis tre bedste tider gemmes sorteret med dato, separat for hver spiller", async function (t) {
  const s = await start(t);
  const a = await (await s.post("/api/spillere", { navn: "A" })).json();
  const b = await (await s.post("/api/spillere", { navn: "B" })).json();
  const tider = [50000, 30000, 3600001, 40000, 10000];
  for (let i = 0; i < tider.length; i++) {
    const svar = await s.post("/api/resultater", { spillerId: a.id, tid: tider[i], rundeId: "1-" + i });
    assert.equal(svar.status, 200);
  }
  await s.post("/api/resultater", { spillerId: b.id, tid: 9000, rundeId: "2-1" });
  const spillere = await (await fetch(s.base + "/api/spillere")).json();
  assert.deepEqual(spillere[0].rekorder.map(function (r) { return r.tid; }), [10000, 30000, 40000]);
  assert.equal(spillere[1].rekorder.length, 1);
  assert.ok(spillere[0].rekorder.every(function (r) { return Number.isFinite(Date.parse(r.dato)); }));
  const disk = JSON.parse(fs.readFileSync(s.datafil, "utf8"));
  assert.deepEqual(disk.spillere, spillere);
});

test("gentaget gem af samme runde giver ikke to rekorder", async function (t) {
  const s = await start(t);
  const spiller = await (await s.post("/api/spillere", { navn: "Test" })).json();
  const resultat = { spillerId: spiller.id, tid: 12345, rundeId: "123-456" };
  await s.post("/api/resultater", resultat);
  const igen = await (await s.post("/api/resultater", resultat)).json();
  assert.equal(igen.rekorder.length, 1);
});

test("forkerte tider, spiller-id'er, JSON og indholdstyper afvises", async function (t) {
  const s = await start(t);
  const spiller = await (await s.post("/api/spillere", { navn: "Test" })).json();
  for (const tid of [-1, 0, 1.5, "1200", Number.MAX_SAFE_INTEGER + 1, null]) {
    assert.equal((await s.post("/api/resultater", { spillerId: spiller.id, tid, rundeId: "123-456" })).status, 400);
  }
  assert.equal((await s.post("/api/resultater", { spillerId: 999, tid: 1200, rundeId: "123-456" })).status, 404);
  assert.equal((await s.post("/api/spillere", null)).status, 400);
  assert.equal((await fetch(s.base + "/api/spillere", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{" })).status, 400);
  assert.equal((await fetch(s.base + "/api/spillere", { method: "POST", body: "navn=Test" })).status, 415);
  assert.equal((await s.post("/api/spillere", { navn: "a".repeat(5000) })).status, 413);
});

test("fremmede browser-origins og Host-værdier afvises", async function (t) {
  const s = await start(t);
  assert.equal((await fetch(s.base + "/api/spillere", { headers: { Origin: "https://example.com" } })).status, 403);
  const status = await new Promise(function (resolve, reject) {
    const request = http.get(s.base + "/api/spillere", { headers: { Host: "evil.example" } }, function (svar) {
      svar.resume();
      resolve(svar.statusCode);
    });
    request.on("error", reject);
  });
  assert.equal(status, 403);
});

test("ødelagte eksisterende data bliver ikke overskrevet", function () {
  const fil = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "minesweeper-broken-")), "spillere.json");
  fs.writeFileSync(fil, "dette er ikke JSON", "utf8");
  assert.throws(function () { lavServer(fil); });
  assert.equal(fs.readFileSync(fil, "utf8"), "dette er ikke JSON");
});
