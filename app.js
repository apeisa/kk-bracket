/* A general note: this file uses a lot of == instead of === for a purpose.
 * The API is very inconsistent in how it stores information:
 * sometimes its numbers and sometimes numeric strings.
 *
 * Don't blindly refactor them to === or you'll make a mess.
 * A better approach would be to actually map what types are used and where.
 */

const tbody = document.querySelector("tbody");
let lastUpdated = null;
let KOODIKLINIKKA_LEAGUE_ID = 19816;
let URL = `https://low6-nhl-brackets-prod.azurewebsites.net/leagues/${KOODIKLINIKKA_LEAGUE_ID}/leaderboard?offset=0&limit=50`;

function isCorrectPick(entry, game) {
  return parseInt(entry[`match_${game.id}_pick`]) === game.winner_id;
}

function isCorrectAmountGames(entry, game) {
  const t1_wins = parseInt(game.team_1_wins);
  const t2_wins = parseInt(game.team_2_wins);
  const seriesLength = t1_wins + t2_wins;
  const howManyGames = entry[`match_${game.id}_match_played`];

  return seriesLength == howManyGames;
}

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
  championLogo.src = `https://www-league.nhlstatic.com/images/logos/teams-current-primary-dark/${champion_id}.svg`;
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
    const pick_key = `match_${gameId}_pick`;

    // If user's pick is not in the running anymore
    if (
      entry[pick_key] != game.team_1_id &&
      entry[pick_key] != game.team_2_id
    ) {
      selectedPick.src = `invalid.svg`;
      selectedPick.alt = "Invalid pick";
    } else {
      // Some logos look better with primary light
      if (entry[pick_key] === "14" || entry[pick_key] === "10") {
        selectedPick.src = `https://www-league.nhlstatic.com/images/logos/teams-current-primary-light/${entry[pick_key]}.svg`;
      } else {
        selectedPick.src = `https://www-league.nhlstatic.com/images/logos/teams-current-primary-dark/${entry[pick_key]}.svg`;
      }
      teamName = teams.find(
        (team) => team.team_id === parseInt(entry[pick_key])
      ).display_name;
      selectedPick.alt = teamName;
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

fetch(URL)
  .then((res) => res.json())
  .then(async ({ entries }) => {
    const series = await fetch(
      "https://low6-nhl-brackets-prod.azurewebsites.net/game"
    ).then((res) => res.json());

    const games = series.game.series_results;
    const teams = series.game.teams;

    const firstRoundGames = games.filter((game) => game.round_sequence === 1);
    const secondRoundGames = games.filter((game) => game.round_sequence === 2);
    const conferenceFinals = games.filter((game) => game.round_sequence === 3);
    const finals = games.filter((game) => game.round_sequence === 4);

    // Choose the round to display based on the earliest round that is not finished
    let roundToDisplay = [];
    if (firstRoundGames.some((series) => !series.is_scored)) {
      roundToDisplay = firstRoundGames;
    } else if (secondRoundGames.some((series) => !series.is_scored)) {
      roundToDisplay = secondRoundGames;
    } else if (conferenceFinals.some((series) => !series.is_scored)) {
      roundToDisplay = conferenceFinals;
    } else {
      roundToDisplay = finals;
    }

    entries.forEach((entry) => {
      let tr = document.createElement("tr");
      createRow(entry, tr, roundToDisplay, teams);
      tbody.appendChild(tr);
    });

    document.querySelector("table").style = "display: block";
    document.querySelector("#loading").style = "display: none";
  });
