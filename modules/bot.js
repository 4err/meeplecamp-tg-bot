const TelegramBot = require('node-telegram-bot-api');
const {
	TOKEN
} = require('../const')

const {
	getCommandData
} = require('./commands')

const {
	faqReminderMessage
} = require('./utils')

const commandsList = [{
		command: `start`,
		description: `Приветственное сообщение`
	},
	{
		command: `meeplecamp`,
		description: `Сколько до кэмпа`
	},
	{
		command: `gamestable`,
		description: `Ссылка на табличку`
	},
	{
		command: `faq`,
		description: `Ссылка на FAQ`
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
		command: `info`,
		description: `Информация по конкретной игре `
	},
	{
		command: `help`,
		description: `Справка`
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
		command: `players`,
		description: `Список игроков`
	},
]

const initializeBot = () => {
	const bot = new TelegramBot(TOKEN, {
		polling: true
	});

	// bot.setMyCommands(JSON.stringify(commandsList)).then((res) => console.log(res))

	bot.onText(/^\/([a-z]*$)/, async (msg, tag) => {
		const chatId = msg.chat.id;
		const [,command] = tag;
		let resp = getCommandData(command);
		if (Math.random() <= 0.3) {
			resp += faqReminderMessage();
		}

		bot.sendMessage(chatId, resp, {
			parse_mode: "html"
		});
	});

	bot.onText(/^\/([gpwh])(\d+$)/, async (msg, tag) => {
		const chatId = msg.chat.id;
		const [,command, param] = tag;
		let resp = getCommandData(command, param);
		if (Math.random() <= 0.3) {
			resp += faqReminderMessage();
		}

		bot.sendMessage(chatId, resp, {
			parse_mode: "html"
		});
	});

	bot.onText(/^\/(info) (.+$)/, async (msg, tag) => {
		const chatId = msg.chat.id;
		const [,command, param] = tag;
		let resp = getCommandData(command, param);
		if (Math.random() <= 0.3) {
			resp += faqReminderMessage();
		}

		bot.sendMessage(chatId, resp, {
			parse_mode: "html"
		});
	});
}

module.exports = {
	initializeBot
}