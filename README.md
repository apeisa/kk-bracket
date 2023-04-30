# KK-Bracket

Käy katsomassa ajossa: [https://kk-bracket.netlify.app](https://kk-bracket.netlify.app)

Nopia custom-UI NHL:n Playoff Bracket -skabaan [Koodiklinikan](https://koodiklinikka.fi)\* liigalle.

Tehty, koska NHL:n oma bracket-webbisivu näyttää pienen laatikon keskellä näyttöä eikä oo helppoa hakea aina sarjojen päätyttyä tilanteita.

## Saako tän omalle liigalle myös?

No tokihan! Kopsaa koodi ja navigoi `app.js`. Vaihda `LEAGUE_ID`:ksi oman liigasi NHL Bracket Challenge ID ja `LEAGUE_DISPLAY_NAME`:ksi oman liigasi nimi. Ole hyvä!

Arvostan jos säilytät footerissa linkitykset tähän repositoryyn ja Juhiksen sivuille. Pakko ei kuitenkaan lisenssin puitteissa ole.

## Mitä jos tää lakkaa toimimasta?

On mahdollista, että NHL sulkee nuo rajapinnat, jolloin nämä bracket-työkalut hajoaa samalla. Jos näin käy, toivottavasti NHL kehittää hyvät työkalut tilalle.

## Dev-juttui

Vanilla-JS:ää, HTML:ää ja CSS:ää ilman mitään krumeluureja.

Käyttää NHL Bracket Challengen API-rajapintoja, jotka näytti olevan auki.

## Contribuoi

Saa tehä pullareita jotka lisää/korjaa/parantelee. Erityisesti jos teet siitä nätimmän kuin se on nyt.

## Lokaalia testausta

Jos tahtoo testailla lokaalisti eri tiloja ja tilanteita, `tests/`-kansiosta löytyy mock API entryille ja sarjojen tilanteille.

Ajamalla `npx json-server tests/mock-api.json`, saa käyttöönsä rajapinnan `http://localhost:3000`, jolla endpointit `/picks` ja `/results`. Korvaa `app.js`:ssä `ENTRIES_URL`:ksi `http://localhost:3000/picks` ja `SERIES_URL`:ksi `http://localhost:3000/results`.

Näin voi kokeilla eri skenaarioita vaihtamalla mock-api.jsonin arvoja. Muista käynnistää `npx json-server tests/mock-api.json` uusiksi muutosten välillä.

## Muut huomiot

Kiitos lehtulle APIen kaivamisesta!

\* Koodiklinikka on vallan mukava suomalainen ohjelmistokehittäjien ja siitä kiinnostuneiden yhteisö. Meitä on reilu 5000 Slackissa ja #penkkiurheilu-kanavalla seurataan lätkää suurella intohimolla.
