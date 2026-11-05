# Krav og kilder

Projekt 2, opgave 3: Minesweeper. Grundlaget er Richards femsiders projektbeskrivelse, læst 2. november og kontrolleret mod Canvas 4. november 2026.

[Projektbeskrivelsen i Canvas](https://iba.instructure.com/courses/13174/pages/projektbeskrivelse?module_item_id=361704) · [Word-filen](https://iba.instructure.com/courses/13174/files/1225458?wrap=1)

## Opgavekrav

| Krav | Løsning |
| --- | --- |
| Minesweeper, valgfri variant | Klassisk 9 × 9 med 10 miner, sikre første klik og automatisk åbning af tomme områder |
| Hold styr på tid | Brugte millisekunder beregnes fra starttidspunktet og vises som minutter og sekunder |
| Indstil længste spilletid | Tidsgrænse på 15–3600 sekunder; nedtælling og afslutning ved udløb |
| Hver spillers tre bedste tider og dato | Serveren sorterer resultater efter tid og bevarer tre poster med dato og tidspunkt |
| Registrering af nye brugere | Skriv et navn for at oprette eller vælge en lokal spillerprofil |
| Frontend og Node.js-backend | Almindelig HTML, CSS og JS; indbygget Node HTTP-server på localhost |
| Data gemmes på serveren | JSON-fil under `data/`; browseren husker ikke spillervalg efter genindlæsning |
| Designbrief og Figma-prototype | `docs/designbrief.pdf` og den tilknyttede klikbare Figma-fil |
| Præsentation | Program, proces, designvalg og implementering kan demonstreres; privat kodeguide opbevares separat |
| Public Git-repository | Projektmappen er klar til et offentligt repository. Offentliggørelse og aflevering er et separat trin |

Planen i dokumentet angiver aflevering **5. november kl. 23:59:59 CET** og præsentation **6. november kl. 08:20–10:55**. Projektperioden er 2.–6. november 2026, men en enkelt deadline-linje siger 2025. Årstallet er derfor en modstrid i kilden. Der er ikke oplyst en individuel præsentationslængde eller et minimum for antal prototypeframes eller sider i designbriefet.

## Valg af JavaScript ud fra undervisningen

| Det, koden bruger | Gennemgået materiale |
| --- | --- |
| `const`, `let`, `if`, `for`, logiske operatorer | JS 01, intro samt betingelser og løkker, 27. august |
| Funktioner, parametre, returværdier, `Math.random` og `Math.floor` | JS 02, bl.a. slide 9 og 20 |
| DOM og `addEventListener`, anonyme callbacks og eventobjektet | JS 02, slide 23–34 |
| Array med objekter, indeks, `push`, `includes`, `splice` og `sort` | JS 03, arrays og objekter, 10. september. Sortering af objekter indgår i slide 33 |
| Løkke til at åbne tomme områder | Kombination af JS 01-løkker og JS 03-arrays. Spilalgoritmen er en ny anvendelse af disse teknikker |
| `setInterval`, `clearInterval`, `async`, `await`, `try/catch` | JS 05, slide 8 og 21 |
| `fetch`, HTTP GET/POST og `JSON.parse/stringify` | JS 06, bl.a. slide 15–23 |
| `require`, `http.createServer`, URL og filhåndtering | UM 04, slide 7, 11–12 og 16–26 |
| POST-data, `request.on('data')`, `request.on('end')`, gem i fil | UM 04, slide 25–26 |

Der bruges ikke React, TypeScript, en frontend-bundler, et UI-bibliotek eller browserens ES-moduler. CommonJS `require` på serveren følger UM 04; den senere UM 05-lektion er ikke en forudsætning.

Det betyder ikke, at hver enkelt hjælpemetode stod ordret på et slide. For eksempel er koordinatberegningen, den konkrete spilalgoritme, datoformateringen og en midlertidig fil ved lagring anvendelser og mindre udvidelser, som skal kunne forklares. Testfilerne bruger desuden Nodes testværktøj som ekstra kvalitetssikring, ikke som en påstand om allerede gennemgået testundervisning.

## Lektionskilder

- [JS 01: Variabler, datatyper, betingelser og løkker](https://iba.instructure.com/courses/13189/modules/items/361816)
- [JS 02: Funktioner, events og DOM](https://iba.instructure.com/courses/13189/modules/items/361818)
- [JS 03: Objekter og arrays](https://iba.instructure.com/courses/13189/modules/items/361820)
- [JS 05: Asynkron JavaScript](https://iba.instructure.com/courses/13189/modules/items/361824)
- [JS 06: JSON og HTTP](https://iba.instructure.com/courses/13189/modules/items/361826)
- [JS 07: Filer og web storage](https://iba.instructure.com/courses/13189/modules/items/361828)
- [UM 04: Node.js, npm og CLI](https://iba.instructure.com/courses/13190/modules/items/361868)

## Teknisk dokumentation

- [Node HTTP](https://nodejs.org/api/http.html)
- [Node fs](https://nodejs.org/api/fs.html)
- [MDN setInterval](https://developer.mozilla.org/en-US/docs/Web/API/Window/setInterval)
- [MDN fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)

Materialer og eksisterende øvelsesnoter er brugt til at vælge niveau og teknikker. Lærerens ZIP-filer med løsningsforslag er ikke kopieret ind i spillet.
