# KK-Bracket

Käy katsomassa ajossa: [https://kk-bracket.netlify.app](https://kk-bracket.netlify.app)

Nopia custom-UI NHL:n Playoff Bracket -skabaan [Koodiklinikan](https://koodiklinikka.fi)\* liigalle.

Tehty, koska NHL:n oma bracket-webbisivu näyttää pienen laatikon keskellä näyttöä eikä oo helppoa hakea aina sarjojen päätyttyä tilanteita.

## Dev-juttui

Vanilla-JS:ää, HTML:ää ja CSS:ää ilman mitään krumeluureja.

Käyttää NHL Bracket Challengen API-rajapintoja, jotka näytti olevan auki.

## Contribuoi

Saa tehä pullareita jotka lisää/korjaa/parantelee. Erityisesti jos teet siitä nätimmän kuin se on nyt.

## Lokaalia testausta

Jos tahtoo testailla lokaalisti eri tiloja ja tilanteita, `tests/`-kansiosta löytyy mock-apit entryille ja sarjojen tilanteille. Ne on wrapattu objektiin, jossa on yksi avain, `"api"`, jotta kansiossa voi ajaa `npx json-server [tiedostonimi]` ja sen jälkeen korvata ko. URL `app.js`-tiedostossa urlilla `http://localhost:3000/api` (jos ajaa mockia molemmista, ajaa niitä eri porteissa ja korvaa portin numeron).

## Muut huomiot

Kiitos lehtulle APIen kaivamisesta!

\* Koodiklinikka on vallan mukava suomalainen ohjelmistokehittäjien ja siitä kiinnostuneiden yhteisö. Meitä on reilu 5000 Slackissa ja #penkkiurheilu-kanavalla seurataan lätkää suurella intohimolla.
