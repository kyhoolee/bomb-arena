
// Global objects
// 1. Phaser game 
window.game = new Phaser.Game(600, 600, Phaser.AUTO, '');
// 2. Player 
window.player = null;
// 3. Socket
window.socket = null;
// 4. Current level
window.level = null;
// 5. Global texture object 
window.TEXTURES = "bbo_textures";

startGame();

function startGame() {
	// socket = io("https://limitless-brook-9339.herokuapp.com:443");
	console.log('Start-game');
    socket = io("http://localhost:8000");

    require("./game/mods/phaser_enhancements");

	// 1. Add required phaser-game-state

	game.state.add("Boot", require("./game/states/boot"));
	game.state.add("Preloader", require("./game/states/preloader"));
	game.state.add("TitleScreen", require("./game/states/title_screen"));
	game.state.add("Lobby", require("./game/states/lobby"));
	game.state.add("StageSelect", require("./game/states/stage_select"));
	game.state.add("PendingGame", require("./game/states/pending_game"));
	game.state.add("Level", require("./game/states/level"));
	game.state.add("GameOver", require("./game/states/game_over"));

	// 2. Start game from state: boot
	game.state.start('Boot');
};