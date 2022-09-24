const TelegramBot = require('node-telegram-bot-api');
const {
  TOKEN,
  COMMANDS_LIST
} = require('../const')

const {
  getCommandData
} = require('./commands')

const {
  faqReminderMessage
} = require('./utils')



const initializeBot = () => {
  const bot = new TelegramBot(TOKEN, {
    polling: true
  });

  //Обновляет список команд бота для меню. 
  // bot.setMyCommands(JSON.stringify(COMMANDS_LIST)).then((res) => console.log(res))

  // Обработка обычных команд
  bot.onText(/^\/([a-z]*$)/, async (msg, tag) => {
    const chatId = msg.chat.id;
    const [, command] = tag;
    const resp = getCommandData(command);

    bot.sendMessage(chatId, resp, {
      parse_mode: "html"
    });
  });

  // Обработка коротких команд поиска по id. 
  bot.onText(/^\/([gpwh])(\d+$)/, async (msg, tag) => {
    const chatId = msg.chat.id;
    const [, command, param] = tag;
    const resp = getCommandData(command, param);

    bot.sendMessage(chatId, resp, {
      parse_mode: "html"
    });
  });

  // Обработка коротких команд поиска по id. 
  bot.onText(/^\/get_location/, async (msg) => {
    const chatId = msg.chat.id;

    bot.sendLocation(chatId, 55.630461, 37.227778);
  });

  bot.onText(/^\/(info_(game|player))$/, async (msg, tag) => {
    const chatId = msg.chat.id;
    const [, command] = tag;
    const resp = command === `info_game` ? `О какой игре вы хотите получить информацию?\nВведите название.` :
      `О каком игроке вы хотите получить информацию? Введите ник, например, @boardgamersha.`
    const prompt = await bot.sendMessage(chatId, resp, {
      parse_mode: "html",
      reply_markup: {
        force_reply: true,
      },
    });
    bot.onReplyToMessage(msg.chat.id, prompt.message_id, async (nameMsg) => {
      let resp = getCommandData(command, nameMsg.text);
      await bot.sendMessage(msg.chat.id, resp, {
        parse_mode: "html"
      });
    });
  });
}

module.exports = {
  initializeBot
}