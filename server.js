"use strict";
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

function lavServer(datafil) {
  const filer = { "/": "index.html", "/stil.css": "stil.css", "/spil.js": "spil.js", "/app.js": "app.js", "/favicon.svg": "favicon.svg" };
  const typer = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml" };
  fs.mkdirSync(path.dirname(datafil), { recursive: true });
  function laesData() {
    if (!fs.existsSync(datafil)) return { naesteId: 1, spillere: [] };
    const data = JSON.parse(fs.readFileSync(datafil, "utf8"));
    if (!Array.isArray(data.spillere) || !Number.isInteger(data.naesteId)) throw new Error("Spillerfilen er ugyldig.");
    return data;
  }
  function gemData(data) {
    fs.writeFileSync(datafil + ".tmp", JSON.stringify(data, null, 2), "utf8");
    fs.renameSync(datafil + ".tmp", datafil);
  }
  function send(response, status, data) {
    response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
    response.end(JSON.stringify(data));
  }
  laesData();
  return http.createServer(function (request, response) {
    const port = request.socket.localPort;
    const vaerter = ["localhost:" + port, "127.0.0.1:" + port];
    if (!vaerter.includes(request.headers.host)) return send(response, 403, { fejl: "Brug localhost." });
    if (request.headers.origin && !["http://localhost:" + port, "http://127.0.0.1:" + port].includes(request.headers.origin)) return send(response, 403, { fejl: "Brug spillets egen side." });
    response.setHeader("Cache-Control", "no-store");
    response.setHeader("X-Content-Type-Options", "nosniff");
    response.setHeader("Content-Security-Policy", "default-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'");
    const sti = new URL(request.url, "http://localhost").pathname;
    try {
      if (request.method === "GET" && sti === "/api/spillere") return send(response, 200, laesData().spillere);
      if (request.method === "GET" && Object.keys(filer).includes(sti)) {
        response.writeHead(200, { "Content-Type": typer[path.extname(filer[sti])] + "; charset=utf-8" });
        return response.end(fs.readFileSync(path.join(__dirname, "public", filer[sti])));
      }
      if (request.method !== "POST" || !["/api/spillere", "/api/resultater"].includes(sti)) return send(response, 404, { fejl: "Siden findes ikke." });
      if (request.headers["content-type"] !== "application/json") return send(response, 415, { fejl: "Send JSON." });
      let tekst = "";
      let forStor = false;
      request.setEncoding("utf8");
      request.on("data", function (del) {
        if (forStor) return;
        tekst += del;
        if (Buffer.byteLength(tekst, "utf8") > 4096) {
          forStor = true;
          send(response, 413, { fejl: "For mange data." });
        }
      });
      request.on("error", function () { response.destroy(); });
      request.on("end", function () {
        if (forStor) return;
        let indhold;
        try { indhold = JSON.parse(tekst); }
        catch (fejl) { return send(response, 400, { fejl: "Ugyldig JSON." }); }
        if (!indhold || typeof indhold !== "object" || Array.isArray(indhold)) return send(response, 400, { fejl: "Send et objekt." });
        try {
          const data = laesData();
          if (sti === "/api/spillere") {
            const navn = typeof indhold.navn === "string" ? indhold.navn.trim() : "";
            if (!navn || navn.length > 24 || /[\u0000-\u001f\u007f]/.test(navn)) return send(response, 400, { fejl: "Brug 1–24 tegn uden linjeskift." });
            for (let i = 0; i < data.spillere.length; i++) {
              if (data.spillere[i].navn.toLowerCase() === navn.toLowerCase()) return send(response, 200, data.spillere[i]);
            }
            const spiller = { id: data.naesteId, navn: navn, rekorder: [] };
            data.naesteId++;
            data.spillere.push(spiller);
            gemData(data);
            return send(response, 201, spiller);
          }
          if (!Number.isSafeInteger(indhold.tid) || indhold.tid < 1 || typeof indhold.rundeId !== "string" || !/^[0-9-]{1,48}$/.test(indhold.rundeId)) return send(response, 400, { fejl: "Ugyldigt resultat." });
          let spiller;
          for (let i = 0; i < data.spillere.length; i++) {
            if (data.spillere[i].id === indhold.spillerId) spiller = data.spillere[i];
          }
          if (!spiller) return send(response, 404, { fejl: "Spilleren findes ikke." });
          for (let i = 0; i < spiller.rekorder.length; i++) {
            if (spiller.rekorder[i].rundeId === indhold.rundeId) return send(response, 200, spiller);
          }
          spiller.rekorder.push({ tid: indhold.tid, dato: new Date().toISOString(), rundeId: indhold.rundeId });
          spiller.rekorder.sort(function (a, b) { return a.tid - b.tid; });
          spiller.rekorder = spiller.rekorder.slice(0, 3);
          gemData(data);
          send(response, 200, spiller);
        } catch (fejl) {
          send(response, 500, { fejl: "Kunne ikke læse eller gemme data." });
        }
      });
    } catch (fejl) {
      send(response, 500, { fejl: "Serverfejl." });
    }
  });
}

if (require.main === module) {
  const server = lavServer(path.join(__dirname, "data", "spillere.json"));
  const port = Number(process.env.PORT || 44462);
  server.on("error", function (fejl) { console.error(fejl.message); });
  server.listen(port, "127.0.0.1", function () { console.log("Minesweeper: http://localhost:" + port); });
}
module.exports = { lavServer };
