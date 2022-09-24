const {

	getFullGamesList
} = require('./modules/utils')

const {
	initializeBot
} = require('./modules/bot')

global.GAMES = [];
global.PLAYERS = [];
getFullGamesList().then(({
	games,
	players
}) => {
	global.GAMES = games;
	global.PLAYERS = players;
	initializeBot();
	console.log('Бот готов.')
	setInterval(async () => {
		const {
			games,
			players
		} = await getFullGamesList();
		global.GAMES = games;
		global.PLAYERS = players;
	}, 1000 * 60)
})