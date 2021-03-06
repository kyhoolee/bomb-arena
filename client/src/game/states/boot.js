var AudioPlayer = require("../util/audio_player");

// 1. Boot - first game state
var Boot = function () {};

module.exports = Boot;

Boot.prototype = {

  preload: function () {
    // Fill in later.
  },

  create: function () {
    // Init game parameters

    game.stage.disableVisibilityChange = true; // So that game doesn't stop when window loses focus.
    game.input.maxPointers = 1;
    AudioPlayer.initialize();

    // 1. Check device to scale game-view
    if (game.device.desktop) {
      // 1.1. Desktop device
      game.stage.scale.pageAlignHorizontally = true;
    } else {
      // 1.2. Mobile device

      // Set game-view scale 
      game.stage.scaleMode = Phaser.StageScaleMode.SHOW_ALL;
      game.stage.scale.minWidth =  480;
      game.stage.scale.minHeight = 260;
      game.stage.scale.maxWidth = 640;
      game.stage.scale.maxHeight = 480;
      game.stage.scale.forceLandscape = true;
      game.stage.scale.pageAlignHorizontally = true;
      game.stage.scale.setScreenSize(true);
    }

    // 2. Start next-state: preloader
    game.state.start('Preloader');
  }
};
