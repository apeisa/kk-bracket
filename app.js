const tbody = document.querySelector("tbody");
let lastUpdated = null;
fetch(
  "https://low6-nhl-brackets-prod.azurewebsites.net/leagues/19816/leaderboard?offset=0&limit=17"
)
  .then((res) => res.json())
  .then(async ({ entries }) => {
    const series = await fetch(
      "https://low6-nhl-brackets-prod.azurewebsites.net/game"
    ).then((res) => res.json());
    const games = series.game.series_results;
    const teams = series.game.teams;

    const firstRound = [101, 102, 103, 104, 105, 106, 107, 108];
    entries.forEach((entry) => {
      let tr = document.createElement("tr");
      const {
        rank,
        entry_name,
        points,
        possible_points,
        updated_at,
        champion_id,
      } = entry;

      let rankTd = document.createElement("td");
      rankTd.innerHTML = rank;
      let nameTd = document.createElement("td");
      nameTd.innerHTML = entry_name;
      nameTd.classList.add("wide");
      let pointsTd = document.createElement("td");
      pointsTd.innerHTML = points;
      let possiblePointsTd = document.createElement("td");
      possiblePointsTd.innerHTML = possible_points;
      let championTd = document.createElement("td");
      let championlogo = document.createElement("img");
      championlogo.src = `https://www-league.nhlstatic.com/images/logos/teams-current-primary-dark/${champion_id}.svg`;
      championlogo.alt = teams.find(
        (team) => team.team_id === parseInt(champion_id)
      ).display_name;
      championTd.appendChild(championlogo);
      championTd.classList.add("narrow");
      championTd.classList.add("logo");

      tr.appendChild(rankTd);
      tr.appendChild(nameTd);
      tr.appendChild(championTd);
      tr.appendChild(pointsTd);
      tr.appendChild(possiblePointsTd);

      firstRound.forEach((gameId) => {
        pick_key = `match_${gameId}_pick`;
        let gameTd = document.createElement("td");
        gameTd.classList.add("narrow");
        gameTd.classList.add("logo");

        let pickSVG = document.createElement("img");

        const currentSeries = games.find((game) => game.id === gameId);
        const winnerId = currentSeries.winner_id;

        // Some logos look better with primary light
        if (entry[pick_key] === "14" || entry[pick_key] === "10") {
          pickSVG.src = `https://www-league.nhlstatic.com/images/logos/teams-current-primary-light/${entry[pick_key]}.svg`;
        } else {
          pickSVG.src = `https://www-league.nhlstatic.com/images/logos/teams-current-primary-dark/${entry[pick_key]}.svg`;
        }
        gameTd.appendChild(pickSVG);

        teamName = teams.find(
          (team) => team.team_id === parseInt(entry[pick_key])
        ).display_name;
        pickSVG.alt = teamName;

        if (winnerId !== null) {
          const t1_wins = parseInt(currentSeries.team_1_wins);
          const t2_wins = parseInt(currentSeries.team_2_wins);
          const seriesLength = t1_wins + t2_wins;
          const howManyGames = entry[`match_${gameId}_match_played`];
          const span = document.createElement("span");
          span.textContent = `(in ${howManyGames})`;
          gameTd.appendChild(span);
          if (parseInt(entry[pick_key]) === winnerId) {
            if (seriesLength == howManyGames) {
              span.classList.add("correct-games");
            }
            gameTd.classList.add("correct");
          } else {
            gameTd.classList.add("incorrect");
          }
        }
        tr.appendChild(gameTd);
      });

      tbody.appendChild(tr);

      if (!lastUpdated) {
        lastUpdated = updated_at;
      } else if (lastUpdated < updated_at) {
        lastUpdated = updated_at;
      }
    });

    lastUpdated = new Date(lastUpdated);
    const lastUpdatedNode = document.querySelector("#last-updated");
    lastUpdatedNode.innerHTML = `Päivitetty: ${lastUpdated.toLocaleString()}`;
  });
