function toJson() {
  const gamesSheet = SpreadsheetApp.openById(MEEPLE_SHEET_ID).getSheetByName(`Игры на кэмпе`);

  const ranges = {
    start_row: 2,
    start_col: 1,
    row: gamesSheet.getLastRow() - 1,
    cols: gamesSheet.getLastColumn()
  }
  const arrData = gamesSheet.getRange(ranges.start_row, ranges.start_col, ranges.row, ranges.cols).getValues();
  const gamesData = [];
  let playersData = [];
  arrData.forEach(it => {
    let [id, hostName, hostGamesCnt, hostTg, gameName, gameDesc, gameLink, gamePlayersCnt, ...gamePlayers] = it;

    if (gameName === "") return;
    gamePlayers = gamePlayers.filter(it => it !== "").map(it => it.trim());
    if (hostName !== "") {
      gamePlayers.push(hostName.trim());
    }
    playersData = playersData.concat(gamePlayers);
    const gameData = {
      id,
      hostName: hostName.trim(),
      hostGamesCnt,
      hostTg,
      gameName: gameName.trim(),
      gameDesc,
      gameLink: gameLink.trim(),
      gamePlayersCnt,
      gamePlayers: gamePlayers.filter(it => it !== "").map(it => it.trim())
    }
    gamesData.push(gameData);
  })
  playersData = playersData.filter((it, i, arr) => arr.findIndex(u => u === it) === i).map((it, i) => ({
    id: i,
    name: it,
    tg: it.match(/@[a-zA-Z0-9]+/) ? it.match(/@[a-zA-Z0-9]+/)[0] : ``,
    host: gamesData.filter(g => g.hostName === it),
    wanted: gamesData.filter(g => g.gamePlayers.includes(it)),
  }));

  return {
    games: gamesData,
    players: playersData
  };
}