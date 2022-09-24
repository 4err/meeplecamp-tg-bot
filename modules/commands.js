const {
  getCount,
  getGamesList,
  pluralize,
  getTopList,
  faqReminderMessage,
  getCommandsList
} = require('./utils')

const {
  TABLE_LINK,
  FAQ_LINK,
  REGISTER_LINK
} = require('../const')

const getCommandData = (command, param = "") => {
  let res = "";
  switch (command) {
    case `start`:
      res = onStart();
      break;
    case `meeplecamp`:
      res = onMeeplecamp();
      break;
    case `links`:
      res = onLinks();
      break;
    case `full`:
      res = onFull();
      break;
    case `topwanted`:
      res = onTopWanted();
      break;
    case `info_game`:
      res = onGameInfo(param);
      break;
    case `g`:
      res = onGameInfo(param, true);
      break
    case `optimists`:
      res = getTopList();
      break;
    case `hosts`:
      res = getTopList(`host`);
      break;
    case `players`:
      res = onPlayers();
      break;
    case `p`:
      res = onPlayerInfo(param, `all`);
      break;
    case `w`:
      res = onPlayerInfo(param, `wanted`);
      break;
    case `h`:
      res = onPlayerInfo(param, `host`);
      break;
    case `info_player`:
      res = onPlayerInfo(param, `all`, false);
      break;
    case `register`:
      res = onRegister();
      break;
    case `help`:
    default:
      res = onHelp();
      break;
  }
  if (Math.random() <= 0.3) {
    res += faqReminderMessage();
  }

  return res;
}

const onStart = () => {
  return `Привет!

  Я твой помощник для мипл кэмпа. Вот что я умею:
  - Считать дни до начала кэмпа;
  - Искать табличку, FAQ и памятку кэмпера;
  - Показывать ссылку на регистрацию;
  - Показывать на карте адрес кэмпа;
  - Искать самые ожидаемые игры;
  - Искать информацию об играх;
  - Показывать топ хостов и оптимистов;
  - Искать информацию об игроках.

  Полный список команд отображается в справке: /help. 
  
  Помочь разработке можно на <a href="https://github.com/4err/meeplecamp-tg-bot">Гитхабе</a>`;
}

const onMeeplecamp = () => {
  return `До ближайшего Миплкэмпа осталось всего ничего! 

  (А именно: <span class="tg-spoiler"><b>${getCount()}</b></span>)`;
}

const onLinks = () => {
  return `
<a href="${TABLE_LINK}">Табличка с играми</a>
<a href="${FAQ_LINK}">Ссылка на FAQ</a>
<a href="${CAMPER_TODO_LINK}">Памятка кэмпера</a>`;
}

const onRegister = () => {
  return REGISTER_LINK ? `<a href="${REGISTER_LINK}">Регистрация</a>` : `Регистрация закрыта или еще не открылась.`
}

const onFull = () => {
  const games = getGamesList(global.GAMES)
  return `Полный список игр в табличке:\n${games}`;
}

const onTopWanted = () => {
  const games = global.GAMES.filter(it => it.hostName === "").sort((a, b) => b.gamePlayersCnt - a.gamePlayersCnt).slice(0, 10).map((it, i) =>
    `${i+1}. ${it.gameName}. <u>${it.gamePlayersCnt}</u>. /g${it.id}`).join('\n');
  return `Топ 10 желаемых игр без хозяина:\nНазвание - Кол-во желающих - Инфо
  \n${games}`;
}

const onGameInfo = (game, isShort = false) => {
  const key = isShort ? `id` : `gameName`;
  const info = global.GAMES.find(it => it[key].toLowerCase() === game.toLowerCase());
  if (!info) {
    return `Такая игра в табличке не найдена.`;
  }
  let host = "Без хоста";
  if (info.hostName !== "") {
    const player = global.PLAYERS.find(p => p.name === info.hostName);
    host = `${info.hostName} /p${player.id}`;
  }
  return `
Номер: ${info.id}
Игра: ${info.gameName}
Описание: ${info.gameDesc !== "" ? info.gameDesc : `-`}
Ссылка BGG: ${info.gameLink !== "" ? `<a href="${info.gameLink}">BGG</a>` : ``}
Хост: ${host}
Хост ТГ: ${info.hostName !== "" ? `@${info.hostTg}` : ``}
Кол-во желающих: ${info.gamePlayersCnt}
Список желающих:\n${
  info.gamePlayers.map((it, i)=> {
  const player = global.PLAYERS.find(p=> p.name === it);
  return `${i+1}. ${it} /p${player.id}`;
})
.join('\n')}`;
}

const onHelp = () => {
  return `
${getCommandsList()}

  Помочь разработке можно на <a href="https://github.com/4err/meeplecamp-tg-bot">Гитхабе</a>`
}

const onPlayers = () => {
  const list = global.PLAYERS.map((it, i) => `${i+1}. ${it.name}. <u>${it.host.length}</u>. <u>${it.wanted.length}.</u> /p${it.id}`).join("\n");
  return `Список игроков:\nИмя - Везет - Планирует - Инфо
  \n${list}`;
}

const onPlayerInfo = (id, action, isShort = true) => {
  const key = isShort ? `id` : `tg`;
  const player = global.PLAYERS.find(it => it[key].toLowerCase() === id.toLowerCase());
  let summary = `Игрок:\n${player.name}`;
  switch (action) {
    case 'all':
      summary += `
      Везет: <u>${pluralize(player.host.length, ['игру', 'игры', 'игр'])}</u> /h${player.id}
      Планирует поиграть: <u>${pluralize(player.wanted.length, ['игру', 'игры', 'игр'])}</u> /w${player.id}`
      break;
    case 'wanted':
      const list = getGamesList(player.wanted);
      summary += `
      Планирует поиграть в игры:
      ${list}`
      break;
    case 'host':
      const host = getGamesList(player.host);
      summary += `
      Везет игры:
      ${host}`
      break;
  }
  return summary;
}

module.exports = {
  getCommandData
}