/* A general note: this file uses a lot of == instead of === for a purpose.
 * The API is very inconsistent in how it stores information:
 * sometimes its numbers and sometimes numeric strings.
 *
 * Don't blindly refactor them to === or you'll make a mess.
 * A better approach would be to actually map what types are used and where.
 */

/* CONFIGURATION */
// If you want to configure this to your league, change the LEAGUE_ID to match
// your league id in NHL Bracket Challenge
// and LEAGUE_DISPLAY_NAME to your league's name for the heading
const LEAGUE_ID = 19816;
const LEAGUE_DISPLAY_NAME = "Koodiklinikan";
/* END OF CONFIGURATION */

const ENTRIES_URL = `https://low6-nhl-brackets-prod.azurewebsites.net/leagues/${LEAGUE_ID}/leaderboard?offset=0&limit=50`;
const SERIES_URL = "https://low6-nhl-brackets-prod.azurewebsites.net/game";

let ENTRIES_DATA = null;
let SERIES_DATA = null;

let title = document.querySelector("title");
title.textContent = `${LEAGUE_DISPLAY_NAME} ${title.textContent}`;

let h1 = document.querySelector("h1");
h1.textContent = `${LEAGUE_DISPLAY_NAME} ${h1.textContent}`;

/**
 * Checks if user's pick for a given series is correct
 * @param {object} entry User's entry
 * @param {object} game Game result
 * @returns user's pick matches the result of game
 */
function isCorrectPick(entry, game) {
  // User picks are strings, winner_id is number. Lovely.
  return parseInt(entry[`match_${game.id}_pick`]) === game.winner_id;
}

/**
 * Checks if user has guessed the right amount of games for a series
 *
 * @param {object} entry
 * @param {object} game
 * @returns
 */
function isCorrectAmountGames(entry, game) {
  // If series isn't finished yet, early return false
  if (!game.is_scored) {
    return false;
  }

  // Amount of wins are strings. Lovely.
  const t1_wins = parseInt(game.team_1_wins);
  const t2_wins = parseInt(game.team_2_wins);
  const seriesLength = t1_wins + t2_wins;
  // Amount of wins is a string. Lovely.
  const howManyGames = parseInt(entry[`match_${game.id}_match_played`]);

  return seriesLength === howManyGames;
}

/**
 * Given a list of series, checks if they have all finished
 * @param {Array} series
 * @returns all series have finished
 */
function hasFinished(series) {
  return series.every((serie) => serie.is_scored);
}

/**
 * Adds dynamic table header cells for series matchups
 * in form of "[homeLogo] - [awayLogo]"
 *
 * @param {Array} games An array of currently displayed series
 * @param {Array} teams An array of teams in the playoffs
 */
function createHeaders(games, teams) {
  const tr = document.querySelector("thead > tr");
  games.forEach((game) => {
    const th = document.createElement("th");
    const div = document.createElement("div");
    div.classList.add("series");
    th.appendChild(div);
    tr.appendChild(th);

    const homeLogo = document.createElement("img");
    homeLogo.alt =
      teams.find((team) => team.team_id == game.team_1_id)?.display_name || "?";
    homeLogo.src = `https://www-league.nhlstatic.com/images/logos/teams-current-primary-light/${game.team_1_id}.svg`;

    const awayLogo = document.createElement("img");
    awayLogo.alt =
      teams.find((team) => team.team_id == game.team_2_id)?.display_name || "?";
    awayLogo.src = `https://www-league.nhlstatic.com/images/logos/teams-current-primary-light/${game.team_2_id}.svg`;

    const separator = document.createElement("span");
    separator.textContent = " - ";
    div.appendChild(homeLogo);
    div.appendChild(separator);
    div.appendChild(awayLogo);
  });
}

/**
 * Creates a row based on user's information:
 * their rank, name, champion pick, points, possible max points
 * and each pick.
 *
 * If a series has already finished, also show if the pick was correct/incorrect
 * and how many games user had guessed
 *
 * @param {object} entry
 * @param {HTMLTableRowElement} tr
 * @param {Array} games
 * @param {Array} teams
 */
function createRow(entry, tr, games, teams) {
  const { rank, entry_name, points, possible_points, champion_id } = entry;

  // Create columns
  let rankTd = document.createElement("td");
  let nameTd = document.createElement("td");
  let pointsTd = document.createElement("td");
  let possiblePointsTd = document.createElement("td");
  let championTd = document.createElement("td");

  tr.appendChild(rankTd);
  tr.appendChild(nameTd);
  tr.appendChild(championTd);
  tr.appendChild(pointsTd);
  tr.appendChild(possiblePointsTd);

  rankTd.innerHTML = rank;

  nameTd.innerHTML = entry_name;
  nameTd.classList.add("wide");

  let championLogo = document.createElement("img");
  championLogo.src = `https://www-league.nhlstatic.com/images/logos/teams-current-primary-light/${champion_id}.svg`;
  championLogo.alt = teams.find(
    (team) => team.team_id === parseInt(champion_id)
  ).display_name;
  championTd.appendChild(championLogo);
  championTd.classList.add("narrow");
  championTd.classList.add("logo");

  pointsTd.innerHTML = points;

  possiblePointsTd.innerHTML = possible_points;

  games.forEach((game) => {
    let gameTd = document.createElement("td");
    let inner = document.createElement("div");
    gameTd.appendChild(inner);
    inner.classList.add("inner");
    let selectedPick = document.createElement("img");
    inner.appendChild(selectedPick);

    gameTd.classList.add("narrow");
    gameTd.classList.add("logo");

    const gameId = game.id;
    const pickKey = `match_${gameId}_pick`;
    const userPick = entry[pickKey];

    // If user's pick is not in the running anymore
    if (userPick != game.team_1_id && userPick != game.team_2_id) {
      selectedPick.src = `dash.svg`;
      selectedPick.alt = "Pick no longer in play";
    } else {
      selectedPick.src = `https://www-league.nhlstatic.com/images/logos/teams-current-primary-light/${userPick}.svg`;
      selectedPick.alt = teams.find(
        (team) => team.team_id === parseInt(userPick)
      ).display_name;
    }

    // If the series is finished, show which picks were right
    // and how many games participants guessed the series would take
    if (game.winner_id !== null) {
      const correctPick = isCorrectPick(entry, game);
      const correctAmountGames = isCorrectAmountGames(entry, game);
      const span = document.createElement("span");
      span.textContent = `(in ${entry[`match_${game.id}_match_played`]})`;
      inner.appendChild(span);
      if (correctPick) {
        if (correctAmountGames) {
          span.classList.add("correct-games");
        }
        gameTd.classList.add("correct");
      } else {
        gameTd.classList.add("incorrect");
      }
    }
    tr.appendChild(gameTd);
  });
}

const fieldset = document.querySelector("fieldset");

function clearTable() {
  clearHeaders();
  document.querySelector("tbody").innerHTML = "";
}

function clearHeaders() {
  const thead = document.querySelector("thead");
  thead.innerHTML = `
  <tr>
          <th>Sijoitus</th>
          <th>Nimi</th>
          <th>Mestarivalinta</th>
          <th>Pisteitä</th>
          <th>Mahdolliset maksimipisteet</th>
        </tr>`;
}

async function renderFields() {
  let [_, series] = await fetchData();
  let games = series.game.series_results;
  const firstRoundGames = games.filter((game) => game.round_sequence === 1);
  const secondRoundGames = games.filter((game) => game.round_sequence === 2);
  const conferenceFinals = games.filter((game) => game.round_sequence === 3);

  fieldset.innerHTML = "<legend>Valitse kierros</legend>";
  if (!hasFinished(firstRoundGames)) {
    const r1 = createRoundSelector("Ensimmäinen kierros", "first", fieldset);
    r1.checked = true;
  } else if (!hasFinished(secondRoundGames)) {
    const r1 = createRoundSelector("Ensimmäinen kierros", "first", fieldset);
    const r2 = createRoundSelector("Toinen kierros", "second", fieldset);
    r2.checked = true;
  } else if (!hasFinished(conferenceFinals)) {
    const r1 = createRoundSelector("Ensimmäinen kierros", "first", fieldset);
    const r2 = createRoundSelector("Toinen kierros", "second", fieldset);
    const r3 = createRoundSelector("Konferenssifinaalit", "third", fieldset);
    r3.checked = true;
  } else {
    const r1 = createRoundSelector("Ensimmäinen kierros", "first", fieldset);
    const r2 = createRoundSelector("Toinen kierros", "second", fieldset);
    const r3 = createRoundSelector("Konferenssifinaalit", "third", fieldset);
    const r4 = createRoundSelector("Stanley Cup", "fourth", fieldset);
    r4.checked = true;
  }
}

function handleRoundChange(ev) {
  const round = ev.target.value;
  renderTable(round);
}

function createRoundSelector(label, name, fieldset) {
  const radio = document.createElement("input");
  radio.type = "radio";
  radio.value = name;
  radio.name = "round";
  radio.id = name;
  const labelNode = document.createElement("label");
  labelNode.textContent = label;
  labelNode.htmlFor = name;

  radio.onchange = handleRoundChange;

  fieldset.appendChild(labelNode);
  fieldset.appendChild(radio);
  return radio;
}

async function fetchData() {
  if (ENTRIES_DATA === null) {
    ENTRIES_DATA = (await fetch(ENTRIES_URL).then((res) => res.json())).entries;
  }

  if (SERIES_DATA === null) {
    SERIES_DATA = await fetch(SERIES_URL).then((res) => res.json());
  }

  return [ENTRIES_DATA, SERIES_DATA];
}

async function renderTable(toDisplay) {
  clearTable();
  const [entries, series] = await fetchData();

  const games = series.game.series_results;
  const teams = series.game.teams;

  const firstRoundGames = games.filter((game) => game.round_sequence === 1);
  const secondRoundGames = games.filter((game) => game.round_sequence === 2);
  const conferenceFinals = games.filter((game) => game.round_sequence === 3);
  const finals = games.filter((game) => game.round_sequence === 4);

  // Choose the round to display based on the earliest round that is not finished
  // If you want to tweak what is displayed, tinker with this.
  let roundToDisplay = [];
  if (!hasFinished(firstRoundGames) || toDisplay === "first") {
    roundToDisplay = firstRoundGames;
  } else if (!hasFinished(secondRoundGames) || toDisplay === "second") {
    roundToDisplay = secondRoundGames;
  } else if (!hasFinished(conferenceFinals) || toDisplay === "third") {
    roundToDisplay = conferenceFinals;
  } else {
    roundToDisplay = finals;
  }

  createHeaders(roundToDisplay, teams);

  const tbody = document.querySelector("tbody");

  entries.forEach((entry) => {
    let tr = document.createElement("tr");
    createRow(entry, tr, roundToDisplay, teams);
    tbody.appendChild(tr);
  });

  document.querySelector("table").style = "display: block";
  document.querySelector("#loading").style = "display: none";
  fieldset.style = "display: block";
}

renderFields().then(() => renderTable());
