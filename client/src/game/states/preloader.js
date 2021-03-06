var TextConfigurer = require("../util/text_configurer");

// 2. Preloader - state for loading game resources
var Preloader = function () {};

module.exports = Preloader;

Preloader.prototype = {

  displayLoader: function() {
    // 1. Display loading 
    this.text = game.add.text(game.camera.width / 2, 250, "Loading... ");
    this.text.anchor.setTo(.5, .5);
    TextConfigurer.configureText(this.text, "white", 32);

    // 2. Update loading progress
    this.load.onFileComplete.add(function(progress) {
        this.text.setText("Loading... " + progress + "%");
    }, this);

    // 3. Start next-state: title-screen when finish loading resources
    this.load.onLoadComplete.add(function() {
        game.state.start("TitleScreen");
    });
  },

  preload: function () {
    this.displayLoader();

    // 1. Load texture in atlas-json-hash format
    // bbo_textures is global texture object
    this.load.atlasJSONHash("bbo_textures", "assets/textures/bbo_textures.png", "assets/textures/bbo_textures.json");

    // 2. Load tile-map
    this.load.tilemap("levelOne", "assets/levels/level_one.json", null, Phaser.Tilemap.TILED_JSON);
    this.load.tilemap("levelTwo", "assets/levels/level_two.json", null, Phaser.Tilemap.TILED_JSON);

    // 3. Load image resource
    this.load.image("tiles", "assets/tiles/tileset.png");
    this.load.image("repeating_bombs", "/assets/repeating_bombs.png");

    // 4. Load audio resource
    this.load.audio("explosion", "assets/sounds/bomb.ogg");
    this.load.audio("powerup", "assets/sounds/powerup.ogg");
    this.load.audio("click", "assets/sounds/click.ogg");

    // 5. Init global sound for button clicking
    window.buttonClickSound = new Phaser.Sound(game, "click", .25);
  }
};
