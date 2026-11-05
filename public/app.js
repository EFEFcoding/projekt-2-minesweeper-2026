"use strict";

const braet = document.querySelector("#braet");
const spillerNavn = document.querySelector("#spiller-navn");
const spillerBesked = document.querySelector("#spiller-besked");
const tidsloft = document.querySelector("#tidsloft");
const flagKnap = document.querySelector("#flag-knap");
const besked = document.querySelector("#status-tekst");
const knapper = [];
let spiller = null;
let spil = lavSpil(180000);
let flagTilstand = false;
let venter = false;

for (let i = 0; i < 81; i++) {
  const knap = document.createElement("button");
  knap.type = "button";
  knap.addEventListener("click", function () { klikFelt(i, flagTilstand); });
  knap.addEventListener("contextmenu", function (event) {
    event.preventDefault();
    klikFelt(i, true);
  });
  braet.appendChild(knap);
  knapper.push(knap);
}

async function hentJSON(sti, data) {
  const valg = {};
  if (data) {
    valg.method = "POST";
    valg.headers = { "Content-Type": "application/json" };
    valg.body = JSON.stringify(data);
  }
  const svar = await fetch(sti, valg);
  const indhold = await svar.json();
  if (!svar.ok) throw new Error(indhold.fejl);
  return indhold;
}

document.querySelector("#spiller-form").addEventListener("submit", async function (event) {
  event.preventDefault();
  const navn = spillerNavn.value.trim();
  spiller = null;
  venter = true;
  visSpil();
  try {
    spiller = await hentJSON("/api/spillere", { navn: navn });
    spillerNavn.value = spiller.navn;
    spillerBesked.textContent = "Du spiller som " + spiller.navn + ".";
    nytSpil();
  } catch (fejl) {
    spillerBesked.textContent = fejl.message;
  }
  venter = false;
  visSpil();
});

function nytSpil() {
  if (!tidsloft.checkValidity()) return tidsloft.reportValidity();
  spil = lavSpil(Number(tidsloft.value) * 1000);
  flagTilstand = false;
  flagKnap.setAttribute("aria-pressed", "false");
  visSpil();
  visRekorder();
}

function visTid() {
  document.querySelector("#brugt-tid").textContent = formatTid(spil.brugtTid);
  document.querySelector("#tid-tilbage").textContent = formatTid(Math.max(0, spil.maksTid - spil.brugtTid));
}

function visRekorder() {
  const liste = document.querySelector("#rekorder");
  liste.textContent = "";
  document.querySelector("#rekord-spiller").textContent = spiller ? spiller.navn : "Vælg en spiller.";
  for (let i = 0; i < 3; i++) {
    const linje = document.createElement("li");
    const rekord = spiller && spiller.rekorder[i];
    linje.textContent = (i + 1) + ". Ingen tid endnu";
    if (rekord) linje.textContent = (i + 1) + ". " + formatTid(rekord.tid) + " - " + new Date(rekord.dato).toLocaleString("da-DK");
    liste.appendChild(linje);
  }
}

function visSpil() {
  const slut = spil.tilstand === "vundet" || spil.tilstand === "tabt" || spil.tilstand === "tid-udloeber";
  const laast = spil.tilstand === "spiller" || venter;
  spillerNavn.disabled = laast;
  document.querySelector("#opret-spiller").disabled = laast;
  tidsloft.disabled = laast;
  document.querySelector("#nyt-spil").disabled = !spiller || venter;
  flagKnap.disabled = !spiller || slut || venter;
  for (let i = 0; i < 81; i++) {
    const felt = spil.felter[i];
    const knap = knapper[i];
    knap.className = "felt";
    knap.textContent = "";
    knap.disabled = !spiller || slut || venter;
    knap.dataset.tal = felt.aaben ? felt.naboMiner : "";
    let navn = "Uåbnet felt";
    if (felt.aaben && !felt.mine) {
      knap.classList.add("aaben");
      knap.textContent = felt.naboMiner || "";
      navn = felt.naboMiner + " miner i nabofelterne";
    } else if (felt.mine && slut) {
      knap.classList.add("mine");
      knap.textContent = spil.tilstand === "vundet" ? "⚑" : "✹";
      navn = "Mine";
    } else if (felt.flag) {
      knap.classList.add("har-flag");
      knap.textContent = "⚑";
      navn = "Flag";
    }
    knap.setAttribute("aria-label", "Felt " + (i + 1) + ": " + navn);
  }
  document.querySelector("#flag-tilbage").textContent = spil.tilstand === "vundet" ? 0 : 10 - spil.antalFlag;
  document.querySelector("#aabne-felter").textContent = spil.antalAabne + " af 71 sikre felter";
  besked.dataset.status = spil.tilstand;
  if (!spiller) besked.textContent = "Vælg eller opret en spiller for at begynde.";
  else if (spil.tilstand === "klar") besked.textContent = "Åbn et felt for at starte.";
  else if (spil.tilstand === "spiller") besked.textContent = "Spillet er i gang.";
  else if (spil.tilstand === "vundet") besked.textContent = "Du vandt på " + formatTid(spil.brugtTid) + ".";
  else if (spil.tilstand === "tabt") besked.textContent = "Du ramte en mine. Prøv et nyt spil.";
  else besked.textContent = "Tiden er gået. Prøv et nyt spil.";
  visTid();
}

async function klikFelt(indeks, flag) {
  if (!spiller || venter || (spil.tilstand !== "klar" && spil.tilstand !== "spiller")) return;
  if (flag) skiftFlag(spil, indeks, Date.now());
  else aabnFelt(spil, indeks, Date.now());
  visSpil();
  if (spil.tilstand !== "vundet") return;
  venter = true;
  visSpil();
  let tekst = "Du vandt! Din tid er gemt.";
  try {
    spiller = await hentJSON("/api/resultater", { spillerId: spiller.id, tid: Math.max(1, spil.brugtTid), rundeId: spil.startTid + "-" + spiller.id });
    visRekorder();
  } catch (fejl) {
    tekst = "Du vandt, men resultatet kunne ikke gemmes.";
  }
  venter = false;
  visSpil();
  besked.textContent = tekst;
}

document.querySelector("#nyt-spil").addEventListener("click", nytSpil);
tidsloft.addEventListener("change", nytSpil);
flagKnap.addEventListener("click", function () {
  flagTilstand = !flagTilstand;
  flagKnap.setAttribute("aria-pressed", String(flagTilstand));
});
setInterval(function () {
  const foer = spil.tilstand;
  opdaterTid(spil, Date.now());
  visTid();
  if (foer !== spil.tilstand) visSpil();
}, 250);
visSpil();
visRekorder();
