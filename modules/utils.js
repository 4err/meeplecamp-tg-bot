const axios = require('axios').default;
const moment = require('moment'); // require

const {
  FAQ_LINK,
  MEEPLE_CAMP_START,
  CAMPER_TODO_LINK,
  COMMANDS_LIST,
  G_APP_LINK
} = require('../const')

moment.locale(`ru`);

const faqReminderMessage = () => {
  return `

Кстати, если ты не прочитал(а) <a href="${FAQ_LINK}">FAQ</a> и <a href="${CAMPER_TODO_LINK}">памятку кэмпера</a>, то тебя не пустят на кэмп.`
}

/**
 * Plural forms for russian words
 * @param  {Integer} count quantity for word
 * @param  {Array} words Array of words. Example: ['депутат', 'депутата', 'депутатов'], ['коментарий', 'коментария', 'комментариев']
 * @return {String}        Count + plural form for word
 */
function pluralize(count, words) {
  var cases = [2, 0, 1, 1, 1, 2];
  return count + ' ' + words[(count % 100 > 4 && count % 100 < 20) ? 2 : cases[Math.min(count % 10, 5)]];
}

const getCount = () => {
  const duration = moment.duration(moment(MEEPLE_CAMP_START).diff(moment()));
  const month = duration.months()
  const days = duration.days();
  const hours = duration.hours();
  const minutes = duration.minutes();

  let text = ``;
  text += month ? pluralize(month, [`месяц`, `месяца`, `месяцев`]) + " " : ``;
  text += days ? pluralize(days, [`день`, `дня`, `дней`]) + " " : ``;
  if (days <= 7) {
    text += hours ? pluralize(hours, [`час`, `часа`, `часов`]) + " " : ``;
    text += minutes ? pluralize(minutes, [`минута`, `минуты`, `минут`]) + " " : ``;
  }
  return text;
}

const getFullGamesList = async () => {
  const res = await axios({
    method: `get`,
    url: G_APP_LINK + `?action=getFullData`,
    headers: {
      "Access-Control-Allow-Origin": "*"
    }
  })
  return res.data;
}

const getGamesList = (games) => {
  const list = games.map((it, i) =>
    `${i+1}. ${it.gameName}. <u>${it.gamePlayersCnt}</u>. ${it.hostName !== "" ? `Да` : `<u>Нет</u>`}. /g${it.id}`).join('\n');
  return `Название - Желающие - Есть хозяин
  \n${list}`;
}

const getTopList = (topName = `optimists`) => {
  const field = topName === `optimists` ? `wanted` : `host`;
  const key = topName === `optimists` ? `w` : `h`;

  const top = global.PLAYERS.sort((a, b) => b[field].length - a[field].length).slice(0, 10)
    .map((it, i) => `${i+1}. ${it.name}. <u>${it[field].length}</u>. /${key}${it.id}`).join("\n");

  return topName === `optimists` ?
    `Топ 10 оптимистов:\nИмя - Планирует - Инфо\n${top}` :
    `Топ 10 хостов:\nИмя - Везет - Инфо\n${top}`;
}

const getCommandsList = () => {
  return COMMANDS_LIST.map(it => '/' + `${it.command} - ${it.command}`).join('\n');
}

module.exports = {
  pluralize,
  getCount,
  faqReminderMessage,
  getGamesList,
  getFullGamesList,
  getTopList,
  getCommandsList
}