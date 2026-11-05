# Minesweeper

Projekt 2, opgave 3. Et dansk Minesweeper med 9 × 9 felter, 10 miner, en tidsgrænse og personlige rekorder.

## Start spillet

Du skal have Node.js 20 eller nyere. Projektet bruger kun indbyggede Node-moduler.

1. Åbn en terminal i projektmappen.
2. Kør `npm start` eller `node server.js`.
3. Åbn **http://localhost:44462**.

På Windows kan du også dobbeltklikke på **Start spil.cmd**. Lad serveren køre, mens du spiller. Stop den med Ctrl+C.

## Sådan spiller du

Skriv dit spillernavn og tryk **Vælg**. Et nyt navn opretter en spiller. Brug samme navn igen for at hente dine gemte rekorder. Store og små bogstaver i navnet gør ingen forskel.

Vælg maksimal spilletid fra 15 til 3600 sekunder. Uret starter ved det første felt, du åbner. Åbn alle 71 sikre felter for at vinde. Det første felt og dets naboer er fri for miner. Tomme områder åbnes automatisk.

- Klik på et felt for at åbne det.
- Højreklik for at sætte eller fjerne et flag.
- På mobil vælger du **Sæt flag** og trykker på et felt.
- **Nyt spil** nulstiller runden. Gemte rekorder bevares.

## Spillere og rekorder

Serveren gemmer spillere og deres tre hurtigste gennemførte spil med dato og tidspunkt i `data/spillere.json`. Filen oprettes automatisk og er udeladt fra Git. Efter en genindlæsning vælger du spilleren igen ved at skrive navnet.

En profil er et lokalt spillernavn uden adgangskode. Browseren beregner tiden, og serveren gemmer den. Der er ikke serverkontrol af hvert spiltræk. Hvis et resultat ikke kan gemmes, vises en fejlbesked.

Serveren kører lokalt på computeren. GitHub Pages kan ikke køre Node-serveren.

## Koden

| Fil | Ansvar |
| --- | --- |
| `public/spil.js` | Bræt, miner, naboer, flag, tid, sejr og tab |
| `public/app.js` | Knapper, visning og kontakt med serveren |
| `server.js` | HTTP-server og lagring af spillere og rekorder |
| `public/index.html` | Sidens indhold og formularer |
| `public/stil.css` | Det enkle layout og grå spillebræt |

JavaScript-filerne består af navngivne funktioner, løkker, arrays, objekter og DOM-hændelser. [Krav og undervisningskilder](docs/krav-og-kilder.md) viser forbindelsen til undervisningen.

## Design

[Download redigerbar Figma-fil](docs/minesweeper.fig?raw=true). Importér filen i Figma via **Import from computer**, eller træk den ind i Figmas filoversigt. Kopien indeholder wireframes, prototypeskærme og klikforbindelser på én side og kan åbnes på din egen Figma-konto.

[Designbrief](docs/designbrief.pdf) · [Redigerbar Figma-fil](https://www.figma.com/design/viA0U9Uwmhw85fXbkVWvaK) · [Klikbar prototype](https://www.figma.com/proto/viA0U9Uwmhw85fXbkVWvaK/Projekt-2-Minesweeper?node-id=5-2&starting-point-node-id=5%3A2)

[Wireframes til computer og mobil](https://www.figma.com/design/viA0U9Uwmhw85fXbkVWvaK?node-id=22-1496) findes i sektionen Wireframes på samme Figma-side som prototypens skærme.

Prototypen viser valg af spiller, start, aktivt spil, sejr, tab og en mobilvisning. Den fulde spilberegning og lagring foregår i programmet. [Prototypeoversigt](docs/figma-prototype.md).

## Test og hjælpemidler

Kør `npm test`. Testene bruger midlertidige datafiler. [Testoversigt](docs/testoversigt.md).

AI er brugt i arbejdet med projektet.
