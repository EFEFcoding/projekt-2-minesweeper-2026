"use strict";
function lavSpil(maksTid) {
  const spil = {
    felter: [], stoerrelse: 9, antalMiner: 10,
    tilstand: "klar", antalAabne: 0, antalFlag: 0,
    startTid: 0, brugtTid: 0, maksTid: maksTid, traadtMine: -1
  };
  for (let i = 0; i < 81; i++) {
    spil.felter.push({ mine: false, aaben: false, flag: false, naboMiner: 0 });
  }
  return spil;
}
function findNaboer(spil, indeks) {
  const naboer = [];
  const raekke = Math.floor(indeks / spil.stoerrelse);
  const kolonne = indeks % spil.stoerrelse;
  for (let r = raekke - 1; r <= raekke + 1; r++) {
    for (let k = kolonne - 1; k <= kolonne + 1; k++) {
      if (r >= 0 && r < spil.stoerrelse && k >= 0 && k < spil.stoerrelse) {
        const nabo = r * spil.stoerrelse + k;
        if (nabo !== indeks) naboer.push(nabo);
      }
    }
  }
  return naboer;
}
function placerMiner(spil, foersteFelt) {
  const sikreFelter = findNaboer(spil, foersteFelt);
  sikreFelter.push(foersteFelt);
  const muligeFelter = [];
  for (let i = 0; i < spil.felter.length; i++) {
    if (!sikreFelter.includes(i)) muligeFelter.push(i);
  }
  for (let i = 0; i < spil.antalMiner; i++) {
    const valg = Math.floor(Math.random() * muligeFelter.length);
    const indeks = muligeFelter.splice(valg, 1)[0];
    spil.felter[indeks].mine = true;
  }
  for (let i = 0; i < spil.felter.length; i++) {
    const naboer = findNaboer(spil, i);
    for (let n = 0; n < naboer.length; n++) {
      if (spil.felter[naboer[n]].mine) spil.felter[i].naboMiner++;
    }
  }
}
function opdaterTid(spil, nu) {
  if (spil.tilstand !== "spiller") return;
  spil.brugtTid = Math.max(0, nu - spil.startTid);
  if (spil.maksTid > 0 && spil.brugtTid >= spil.maksTid) {
    spil.brugtTid = spil.maksTid;
    spil.tilstand = "tid-udloeber";
  }
}

function aabnFelt(spil, indeks, nu) {
  opdaterTid(spil, nu);
  if (spil.tilstand !== "klar" && spil.tilstand !== "spiller") return;
  const felt = spil.felter[indeks];
  if (!felt || felt.aaben || felt.flag) return;
  if (spil.tilstand === "klar") {
    placerMiner(spil, indeks);
    spil.startTid = nu;
    spil.tilstand = "spiller";
  }
  if (felt.mine) {
    felt.aaben = true;
    spil.traadtMine = indeks;
    spil.tilstand = "tabt";
    return;
  }
  const koe = [indeks];
  for (let i = 0; i < koe.length; i++) {
    const aktueltFelt = spil.felter[koe[i]];
    if (aktueltFelt.aaben || aktueltFelt.flag || aktueltFelt.mine) continue;
    aktueltFelt.aaben = true;
    spil.antalAabne++;
    if (aktueltFelt.naboMiner === 0) {
      const naboer = findNaboer(spil, koe[i]);
      for (let n = 0; n < naboer.length; n++) koe.push(naboer[n]);
    }
  }
  if (spil.antalAabne === spil.felter.length - spil.antalMiner) {
    spil.tilstand = "vundet";
  }
}

function skiftFlag(spil, indeks, nu) {
  opdaterTid(spil, nu);
  if (spil.tilstand !== "klar" && spil.tilstand !== "spiller") return;
  const felt = spil.felter[indeks];
  if (!felt || felt.aaben) return;
  if (felt.flag) {
    felt.flag = false;
    spil.antalFlag--;
  } else if (spil.antalFlag < spil.antalMiner) {
    felt.flag = true;
    spil.antalFlag++;
  }
}

function formatTid(millisekunder) {
  const sekunder = Math.floor(millisekunder / 1000);
  const minutter = Math.floor(sekunder / 60);
  return String(minutter).padStart(2, "0") + ":" + String(sekunder % 60).padStart(2, "0");
}
if (typeof module !== "undefined") {
  module.exports = { lavSpil, findNaboer, aabnFelt, skiftFlag, opdaterTid, formatTid };
}
