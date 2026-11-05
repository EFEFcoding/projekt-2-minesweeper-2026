# Testoversigt

Kontrolleret 5. november 2026 efter forenkling af koden.

## Automatiske test

**19 af 19 bestået.** Kør `npm test`.

Testene kontrollerer spilregler og HTTP-server: alle 81 mulige første klik, præcis 10 miner, naboer, tomme områder, flag i spilmodellen, sejr, tab, tidsudløb og nulstilling. Serverkontrollen dækker valg eller oprettelse af spiller, tre bedste tider med dato, gentaget resultat, ugyldige data, private filstier og data efter servergenstart.

En eksisterende ødelagt datafil bliver ikke overskrevet. Testene bruger egne midlertidige mapper.

## Browserkontrol af den korte version

En separat lokal testserver og profilen DemoEnkel blev brugt. Testdata indgår ikke i projektets spillerfil.

| Afprøvning | Resultat |
| --- | --- |
| Opret en spiller gennem navneformularen | Bestået |
| Sæt og fjern flag på brættet før første åbning | Bestået; uret starter ikke |
| Første åbning og låsning af spiller- og tidsvalg | Bestået |
| Udløb af 15 sekunder | Bestået; 00:00 og låst bræt |
| Gennemfør et helt spil gennem brugerfladen | Bestået; 71 sikre felter åbnet |
| Gem en vundet runde | Bestået; tiden vises som 00:31 med dato og tidspunkt |
| Genindlæs og vælg samme navn med små bogstaver | Bestået; samme spiller og gemte rekord hentes |
| Mobilvisning ved 390 pixels | Bestået; ingen vandret overflow |
| Mobilens flagknap og Nyt spil | Bestået; flagtilstanden nulstilles |

## Prototype og afgrænsning

Figma indeholder seks redigerbare prototypeskærme og to wireframes til computer og mobil. Alt ligger på én Figma-side. Wireframes og prototype er visuelt gennemgået. Navneformularen er tilpasset den kortere kode. Prototypens skrifttype er Manrope; programmet bruger Arial.

Der er ikke gennemført interview eller ekstern brugertest. Browserkontrollen er teknisk afprøvning af programmet. Profilerne har ikke adgangskoder, og serveren kontrollerer ikke hvert spiltræk.
