const MEEPLE_SHEET_ID = `<id текущей таблицы с играми>`;

function doGet(e) {
  const action = e.parameters[`action`];
  const games = toJson();
  if (action == "getFullData") {
    return ContentService.createTextOutput(JSON.stringify(games));
  }
}