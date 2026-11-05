"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { lavSpil, findNaboer, aabnFelt, skiftFlag, opdaterTid, formatTid } = require("../public/spil.js");

test("nyt spil har 81 selvstændige felter og ingen miner før første klik", function () {
  const spil = lavSpil(180000);
  assert.equal(spil.felter.length, 81);
  assert.notEqual(spil.felter[0], spil.felter[1]);
  assert.equal(spil.tilstand, "klar");
  assert.equal(spil.felter.filter(function (f) { return f.mine; }).length, 0);
});

test("hjørner, kanter og midte får kun reelle naboer", function () {
  const spil = lavSpil(0);
  assert.deepEqual(findNaboer(spil, 0), [1, 9, 10]);
  assert.deepEqual(findNaboer(spil, 8), [7, 16, 17]);
  assert.equal(findNaboer(spil, 4).length, 5);
  assert.equal(findNaboer(spil, 40).length, 8);
});

test("første klik er sikkert alle 81 steder, og der placeres præcis 10 forskellige miner", function () {
  for (let i = 0; i < 81; i++) {
    const spil = lavSpil(0);
    aabnFelt(spil, i, 1000);
    const sikre = findNaboer(spil, i).concat(i);
    for (const indeks of sikre) assert.equal(spil.felter[indeks].mine, false);
    assert.equal(spil.felter.filter(function (f) { return f.mine; }).length, 10);
    assert.equal(spil.felter[i].aaben, true);
    assert.notEqual(spil.tilstand, "tabt");
  }
});

test("nabotal svarer til de faktiske miner, og tomme områder åbnes uden miner", function () {
  const spil = lavSpil(0);
  aabnFelt(spil, 40, 1000);
  for (let i = 0; i < 81; i++) {
    const forventet = findNaboer(spil, i).filter(function (n) { return spil.felter[n].mine; }).length;
    assert.equal(spil.felter[i].naboMiner, forventet);
    if (spil.felter[i].mine) assert.equal(spil.felter[i].aaben, false);
  }
  assert.ok(spil.antalAabne >= 9);
});

test("flag kan sættes og fjernes, og højst ti flag kan være aktive", function () {
  const spil = lavSpil(0);
  for (let i = 0; i < 11; i++) skiftFlag(spil, i, 1000);
  assert.equal(spil.antalFlag, 10);
  assert.equal(spil.felter[10].flag, false);
  aabnFelt(spil, 0, 1000);
  assert.equal(spil.tilstand, "klar");
  skiftFlag(spil, 0, 1000);
  assert.equal(spil.antalFlag, 9);
  aabnFelt(spil, 0, 2000);
  assert.equal(spil.felter[0].aaben, true);
  assert.equal(spil.felter[1].flag, true);
  assert.equal(spil.felter[1].aaben, false);
});

test("en mine afslutter spillet, og nye klik ændrer ikke resultatet", function () {
  const spil = lavSpil(0);
  aabnFelt(spil, 40, 1000);
  const mine = spil.felter.findIndex(function (f) { return f.mine; });
  aabnFelt(spil, mine, 2400);
  assert.equal(spil.tilstand, "tabt");
  assert.equal(spil.brugtTid, 1400);
  const foer = JSON.stringify(spil);
  aabnFelt(spil, 80, 3000);
  skiftFlag(spil, 79, 3000);
  assert.equal(JSON.stringify(spil), foer);
});

test("alle 71 sikre felter giver sejr uden krav om flag", function () {
  const spil = lavSpil(0);
  aabnFelt(spil, 40, 1000);
  for (let i = 0; i < 81; i++) if (!spil.felter[i].mine) aabnFelt(spil, i, 3456);
  assert.equal(spil.tilstand, "vundet");
  assert.equal(spil.antalAabne, 71);
  assert.equal(spil.brugtTid, 2456);
});

test("tid starter først ved åbning og er korrekt efter en forsinket timer", function () {
  const spil = lavSpil(180000);
  skiftFlag(spil, 0, 1000);
  opdaterTid(spil, 90000);
  assert.equal(spil.brugtTid, 0);
  aabnFelt(spil, 40, 100000);
  opdaterTid(spil, 123456);
  assert.equal(spil.brugtTid, 23456);
});

test("udløbet tid blokerer selv et klik, der kommer før næste timeropdatering", function () {
  const spil = lavSpil(15000);
  aabnFelt(spil, 40, 1000);
  const lukket = spil.felter.findIndex(function (f) { return !f.aaben && !f.mine; });
  aabnFelt(spil, lukket, 16000);
  assert.equal(spil.tilstand, "tid-udloeber");
  assert.equal(spil.brugtTid, 15000);
  assert.equal(spil.felter[lukket].aaben, false);
});

test("uden tidsloft kan spillet fortsætte, og et nyt spil nulstiller alt", function () {
  const spil = lavSpil(0);
  aabnFelt(spil, 40, 1000);
  opdaterTid(spil, 2000000);
  assert.equal(spil.tilstand, "spiller");
  const nyt = lavSpil(30000);
  assert.equal(nyt.antalFlag, 0);
  assert.equal(nyt.antalAabne, 0);
  assert.equal(nyt.startTid, 0);
  assert.equal(nyt.brugtTid, 0);
});

test("tidsformat viser minutter og sekunder med foranstillede nuller", function () {
  assert.equal(formatTid(0), "00:00");
  assert.equal(formatTid(999), "00:00");
  assert.equal(formatTid(61000), "01:01");
  assert.equal(formatTid(3600000), "60:00");
});
