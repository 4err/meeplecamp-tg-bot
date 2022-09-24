const TOKEN = '<BOT_TOKEN>';
const G_APP_LINK = '<Ссылка на опубликованное приложение Google App Script>';

const TABLE_LINK = '<Ссылка на текущую табличку с играми>';
const REGISTER_LINK = '<Ссылка на регистрацию или null>';

const MEEPLE_CAMP_START = [2022, 10, 3];
const FAQ_LINK = 'https://vk.com/@meeple_camp-faq';
const CAMPER_TODO_LINK = 'https://vk.com/@meeple_camp-pamyatka';

const COMMANDS_LIST = [{
    command: `start`,
    description: `Приветственное сообщение`
  },
  {
    command: `meeplecamp`,
    description: `Сколько до кэмпа`
  },
  {
    command: `links`,
    description: `Полезные ссылки`
  },
  {
    command: `get_location`,
    description: `Найти кэмп на карте`
  },
  {
    command: `register`,
    description: `Ссылка на регистрацию`
  },
  {
    command: `full`,
    description: `Текущий список игр`
  },
  {
    command: `topwanted`,
    description: `Топ ожидаемых игр`
  },
  {
    command: `info_game`,
    description: `Информация по конкретной игре`
  },
  {
    command: `players`,
    description: `Список игроков`
  },
  {
    command: `optimists`,
    description: `Топ желающих поиграть`
  },
  {
    command: `hosts`,
    description: `Топ хостов`
  },
  {
    command: `info_player`,
    description: `Информация об игроке `
  },
  {
    command: `help`,
    description: `Справка`
  },
]

module.exports = {
  TOKEN,
  G_APP_LINK,
  TABLE_LINK,
  FAQ_LINK,
  CAMPER_TODO_LINK,
  MEEPLE_CAMP_START,
  COMMANDS_LIST,
  REGISTER_LINK
}