const {
	faqReminderMessage,
	getCount,
	getGamesList,
	pluralize
} = require('./utils')

const {
	TABLE_LINK,
	FAQ_LINK
} = require('../const')

const getCommandData = (command, param = "") => {
	switch (command) {
		case `start`:
			return onStart();
		case `meeplecamp`:
			return onMeeplecamp();
		case `gamestable`:
			return onGamesTable();
		case `faq`:
			return onFaq();
		case `full`:
			return onFull();
		case `topwanted`:
			return onTopWanted();
		case `info`:
			return onInfo(param);
		case `g`:
			return onInfo(param, true);
		case `optimists`:
			return onOptimists();
		case `hosts`:
			return onHosts();
		case `players`:
			return onPlayers();
		case `p`:
			return onPlayerInfo(param, `all`);
		case `w`:
			return onPlayerInfo(param, `wanted`);
		case `h`:
			return onPlayerInfo(param, `host`);
			// case `/start`:
			// 	return onStart();
		case `/help`:
		default:
			return onHelp();
	}
}

const onStart = () => {
	return `Привет!

	Я твой помощник для мипл кэмпа. Вот что я умею:
	- Считать дни до начала кэмпа;
	- Искать табличку, FAQ и памятку кэмпера;
	- Искать самые ожидаемые игры;
	- Искать просто информацию об игре;

	Со списком команд можно ознакомиться с помощью команды /help`;
}

const onMeeplecamp = () => {
	return `До ближайшего Миплкэмпа осталось всего ничего! 

	(а именно: <span class="tg-spoiler"><b>${getCount()}</b></span>)`;
}

const onGamesTable = () => {
	return `<a href="${TABLE_LINK}">Табличка с играми</a>`;
}

const onFaq = () => {
	return `<a href="${FAQ_LINK}">Ссылка на FAQ</a>`;
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

const onInfo = (game, isShort = false) => {
	if (!game) {
		return `Укажите название игры после команды /info`
	}
	const info = isShort ?
		global.GAMES.find(it => it.id == game) :
		global.GAMES.find(it => it.gameName === game);
	console.log(info);
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
	info.gamePlayers.map(it=> {
	const player = global.PLAYERS.find(p=> p.name === it);
	return `${it} /p${player.id}`;
})
.join('\n')}`;
}

const onHelp = () => {
	return `
	/\start - Приветственное сообщение
	/\meeplecamp - Сколько до кэмпа
	/\gamestable - Ссылка на табличку
	/faq - Ссылка на FAQ
	/full - Текущий список игр
	/topwanted - Топ ожидаемых игр
	/\info название - Информация по конкретной игре 
	/\optimists - Топ желающих поиграть 
	/\hosts - Топ хостов
	/\players - Список игроков
	`
}

const onOptimists = () => {
	const top = global.PLAYERS.sort((a, b) => b.wanted.length - a.wanted.length).slice(0, 10)
		.map((it, i) => `${i+1}. ${it.name}. <u>${it.wanted.length}</u>. /w${it.id}`).join("\n");
	return `Топ 10 оптимистов:\nИмя - Планирует - Инфо
	\n${top}`;
}

const onHosts = () => {
	const top = global.PLAYERS.sort((a, b) => b.host.length - a.host.length).slice(0, 10)
		.map((it, i) => `${i+1}. ${it.name}. <u>${it.host.length}</u>. /h${it.id}`).join("\n");
	return `Топ 10 хостов:\nИмя - Везет - Инфо
	\n${top}`;
}

const onPlayers = () => {
	const list = global.PLAYERS.map((it, i) => `${i+1}. ${it.name}. <u>${it.host.length}</u>. <u>${it.wanted.length}.</u> /p${it.id}`).join("\n");
	return `Список игроков:\nИмя - Везет - Планирует - Инфо
	\n${list}`;
}

const onPlayerInfo = (id, action) => {
	const player = global.PLAYERS.find(it => it.id == id);
	let summary = `Игрок: ${player.name}`;
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