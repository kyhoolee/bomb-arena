var Fader = require("../util/fader");

// 3. TitleScreen - state for showing main game menu
function TitleScreen() {};


// Global constant values
var titleOffsetX = 55;
var titleOffsetY = 20;

var buttonOffsetX = 40;
var startButtonOffsetY = 275;
var howToButtonOffsetY = 360;

var bombermanOffsetX = 305;
var bombermanOffsetY = 265;

var firstBombOffsetX = bombermanOffsetX + 12;
var firstBombOffsetY = bombermanOffsetY + 57;

var secondBombOffsetX = bombermanOffsetX + 185;
var secondBombOffsetY = bombermanOffsetY + 141;

var cloudRightmostPointX = 700;

var cloudTweenDuration = 80000;



var cloudData = [
	{startingX: 400, startingY: 50, image: "cloud1"},
	{startingX: -150, startingY: 140, image: "cloud1"},
	{startingX: 375, startingY: 200, image: "cloud1"},
	{startingX: 330, startingY: -20, image: "cloud1"},
	{startingX: 110, startingY: 110, image: "cloud2"},
	{startingX: -300, startingY: 140, image: "cloud2"},
	{startingX: -300, startingY: -30, image: "cloud2"},
	{startingX: 0, startingY: 140, image: "cloud3"},
	{startingX: -75, startingY: 200, image: "cloud4"},
	{startingX: 200, startingY: 20, image: "cloud5"},
	{startingX: 100, startingY: -20, image: "cloud5"},
	{startingX: -200, startingY: 250, image: "cloud6"},
	{startingX: 40, startingY: 80, image: "cloud7"},
	{startingX: 200, startingY: 180, image: "cloud1"},
	{startingX: -150, startingY: 20, image: "cloud5"},
	{startingX: 300, startingY: 230, image: "cloud4"}
];

TitleScreen.prototype = {
	create: function() {

		// 1. Game-state parameters
		this.showingInstructions = false;
		this.justClickedHowTo = false;
		this.justClickedOutOfHowTo = false;

		// 2. Create menu UI 
		// 2.1. Background
		this.createClouds();
		// 2.2. Menu button
		this.createButtons();
	
		// 2.3. Menu button initial moving-animations 
		var startButtonTween = this.createInitialButtonTween(this.startButton, 200);
		var howToButtonTween = this.createInitialButtonTween(this.howToButton, 400);
	
		// 2.4. Title image
		var title = game.add.image(titleOffsetX, titleOffsetY - 200, TEXTURES, "titlescreen/title.png");
	
		// 2.5 Moving-Animation for title image
		var titleTween = game.add.tween(title);
		titleTween.to({y: titleOffsetY}, 500, Phaser.Easing.Bounce.Out, true, 200).start();
	
		// 2.6. Bomberman title sprite
		var bomberman = game.add.sprite(bombermanOffsetX + 400, bombermanOffsetY, TEXTURES, "titlescreen/bomberman/bomberman_01.png");
		bomberman.animations.add("bomb_animation", [
				"titlescreen/bomberman/bomberman_01.png",
				"titlescreen/bomberman/bomberman_02.png",
				"titlescreen/bomberman/bomberman_03.png",
				"titlescreen/bomberman/bomberman_04.png",
				"titlescreen/bomberman/bomberman_05.png"
			], 5, true);
	
		// 2.7. Bomberman title sprite moving-animation
		var bombermanTween = game.add.tween(bomberman).to({x: bombermanOffsetX}, 300, Phaser.Easing.Default, false, 100);
		bombermanTween.onComplete.addOnce(function() {
			bomberman.animations.play("bomb_animation");
		});
	
		// 2.8 Start these title moving animation
		bombermanTween.start();
		startButtonTween.start();
		howToButtonTween.start();
	},

	createInitialButtonTween: function(button, delay) {
		// Create moving tween for button 
		return game.add.tween(button).to(
				{x: buttonOffsetX}, 300, Phaser.Easing.Default, false, delay
			);
	},

	createClouds: function() {
		// Create background image: clouds 
		var cloudRightmostPoint = game.camera.width;
		var cloudLeftmostPointX = -260;
		// Cloud moving looping through camera-width
		var tweenDuration = cloudTweenDuration * (game.camera.width - cloudLeftmostPointX) / game.camera.width;

		// Create background image
		game.add.image(0, 0, TEXTURES, "titlescreen/background.png");

		// Set moving tween for clouds 
		for(var x = 0; x < cloudData.length; x++) {
			// Make moving tween function for each cloud 
			(function(data) {
				// Init cloud image
				var cloudImage = game.add.image(data.startingX, data.startingY, TEXTURES, "titlescreen/" + data.image + ".png");
				cloudImage.anchor.setTo(0, 0);

				// Create moving tween - through game-camera width
				var initialTweenDuration = cloudTweenDuration * (game.camera.width - data.startingX) / game.camera.width;
				var cloudTween = game.add.tween(cloudImage).to(
					{x: cloudRightmostPointX}, 
					initialTweenDuration, 
					Phaser.Easing.Default, 
					true, 0, 0);

				// moving again when complete moving 
				var completionFunction = function() {
					cloudImage.x = cloudLeftmostPointX;
					game.add.tween(cloudImage).to(
						{x: cloudRightmostPointX}, 
						tweenDuration, 
						Phaser.Easing.Default, 
						true, 0, -1).start();	
				};

				cloudTween.onComplete.addOnce(completionFunction);
				cloudTween.start();
			})(cloudData[x]);
		};
	},

	createButtons: function() {
		this.startButton = game.add.button(
			buttonOffsetX - 250, startButtonOffsetY, 
			TEXTURES, 
			function() {
				if(!this.showingInstructions && !this.justClickedOutOfHowTo) {
					Fader.fadeOut(function() {
						game.state.start("Lobby");
					});
				}
			}, 
			this, 
			"titlescreen/buttons/startbutton_02.png", 
			"titlescreen/buttons/startbutton_01.png"
		);
		this.startButton.setDownSound(buttonClickSound);


		this.howToButton = game.add.button(
			buttonOffsetX - 250, howToButtonOffsetY, 
			TEXTURES, 
			function() {
				if(!this.showingInstructions && !this.justClickedOutOfHowTo) {
					this.showingInstructions = true;
					Fader.fadeOut(function() {
						this.howTo = game.add.image(0, 0, TEXTURES, "titlescreen/howtoplay.png");
						this.justClickedHowTo = true;
						Fader.fadeIn();
					}, this);
				}
			}, 
			this, 
			"titlescreen/buttons/howtobutton_02.png", 
			"titlescreen/buttons/howtobutton_01.png"
		);
		this.howToButton.setDownSound(buttonClickSound);
	},

	update: function() {
		if(!game.input.activePointer.isDown && this.justClickedHowTo) {
			this.justClickedHowTo = false;
		}

		if(!game.input.activePointer.isDown && this.justClickedOutOfHowTo) {
			this.justClickedOutOfHowTo = false;
		}

		if(game.input.activePointer.isDown && this.showingInstructions && !this.justClickedHowTo) {
			buttonClickSound.play();
			this.showingInstructions = false;
			this.justClickedOutOfHowTo = true;
			Fader.fadeOut(function() {
				this.howTo.destroy();
				Fader.fadeIn();
			}, this);
		}
	}
}

module.exports = TitleScreen;