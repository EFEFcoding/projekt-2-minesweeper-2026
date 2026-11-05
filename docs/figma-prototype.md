# Figma-prototype

[Åbn den redigerbare designfil](https://www.figma.com/design/viA0U9Uwmhw85fXbkVWvaK/Projekt-2-%E2%80%94-Minesweeper-2026?node-id=0-1)

[Start den klikbare prototype](https://www.figma.com/proto/viA0U9Uwmhw85fXbkVWvaK/Projekt-2-%E2%80%94-Minesweeper-2026?node-id=5-2&starting-point-node-id=5%3A2)

## Download og import

[Download den redigerbare Figma-fil](minesweeper.fig?raw=true). Kopien er eksporteret fra Figma og indeholder den samlede side med wireframes, seks prototypeskærme, feltkomponenten og klikforbindelserne.

Hvis et af Figma-linkene ikke virker, kan den downloadede kopi bruges direkte via import. Åbn Figmas filoversigt, vælg **Import from computer**, og vælg den downloadede `.fig`-fil. Du kan også trække filen ind i filoversigten. Figma opretter en selvstændig kopi på din konto, som du kan åbne og redigere.

## Wireframes

[Åbn Wireframes-sektionen i Figma](https://www.figma.com/design/viA0U9Uwmhw85fXbkVWvaK?node-id=22-1496) · [Se samlet PNG](billeder/wireframes.png)

Figma-filen har én side, **Minesweeper · Wireframes og prototype**. Her er både de seks prototypeskærme og en Wireframes-sektion med en grov skitse til computer og en til mobil. Skitserne bruger enkle bokse, korte labels og grå streger som pladsholdere for tekst. Spillebrættet er vist som én stor boks med et kryds. De består af redigerbare lag og viser kun placering af indhold.

## Forløb

1. **01 Opret spiller:** Navnet Demo er forudfyldt i prototypen. Klik på Vælg.
2. **02 Klar til spil:** Klik på et felt for at starte spillet.
3. **03 Spillet er i gang:** Klik på et lukket felt. Prototypen viser enten sejr eller tab afhængigt af det valgte felt. Øverste venstre felt fører til sejr; tredje felt i øverste række fører til tab.
4. **04 Vundet og gemt:** Se et eksempel på resultat og en rekord. Klik Nyt spil for at vende tilbage.
5. **05 Ramt en mine:** Se fejltilstanden og start en ny runde.
6. **06 Mobil:** Separat visning af layoutet ved 390 pixels bredde. Mobilrammen er et layout-eksempel; det sammenhængende klikforløb findes i desktoprammerne.

Vælg-knappen i klar-, vundet- og tabt-tilstandene fører tilbage til navnevalget. Der er 114 navigationsforbindelser i desktopforløbet.

Prototypen er tilpasset den enkle navneformular: ét felt og én Vælg-knap. Programmet opretter et nyt navn og henter en eksisterende profil gennem samme formular.

## Indhold og afgrænsning

Farver og overskrifter er opdateret til programmets enklere udtryk med lysegrå baggrund, hvide paneler og blå knapper. Brætstørrelse og informationsstruktur følger programmet. Programmet bruger Arial. Prototypen beholder Manrope, fordi Arial ikke var tilgængelig i Figma-værktøjet. Afstande og felternes kanter er derfor en visuel skitse, ikke en præcis gengivelse af CSS-layoutet. Hver prototypeskærm har 81 forekomster af en redigerbar feltkomponent. Tekst, knapper og symboler er selvstændige Figma-lag.

Prototypen demonstrerer brugerforløb og tilstande. Den beregner ikke et fuldt Minesweeperspil eller gemmer data. Det gør Node/JavaScript-programmet. Demo-navn og viste tider er demonstrationsdata.

Filen er oprettet i skolens Figma-team, `frefla01@iba.dk's team`. Figma kan kræve login eller adgang til filen. Kontrollér lærerens adgang ved aflevering; et link i et offentligt GitHub-repository ændrer ikke i sig selv Figma-filens adgang.
