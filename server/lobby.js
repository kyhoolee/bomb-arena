/**
* This module contains all logic related to hosting/joining games.

Game matching between group of players happen here
*/

var PendingGame = require("./entities/pending_game");
var MapInfo = require("../common/map_info");

/**
 * Default: 
 * - lobbySlots are null-array
 * - lobbyId is undefined = -1
 * - numLobbySlots = 7 by default
 */

var lobbySlots = [];
var lobbyId = -1;
var numLobbySlots = 7;

var Lobby = {
	/**
	 * Get list of lobby-slot
	 * Each lobby-slot is a slot for matching players into one game
	 */
	getLobbySlots: function() {
		return lobbySlots;
	},

	/**
	 * Get lobby-id - in case of running multi lobby
	 */
	getLobbyId: function() {
		return lobbyId;
	},

	/**
	 * Get number of slots in lobby - each slot is used for matching game 
	 */
	getNumLobbySlots: function() {
		return numLobbySlots;
	},

	/**
	 * Broadcase the update of slot in lobby to all players
	 * @param {*} gameId - The id of the game in this slot
	 * @param {*} newState - The new state-data of the game in this slot 
	 */
	broadcastSlotStateUpdate: function(gameId, newState) {
		broadcastSlotStateUpdate(gameId, newState);
	},

	/**
	 * Initialize lobby data
	 */
	initialize: function() {
		console.log('Initialize-Lobby-Slots: ', numLobbySlots);
		// Create numLobbySlots - lobby-slot with empty PendingGame 
		for(var i = 0; i < numLobbySlots; i++) {
			
			lobbySlots.push(new PendingGame());
		}

		console.log('Slot :: ', lobbySlots);
	},

	/**
	 * Process event enter-lobby of player
	 * @param {*} data 
	 */
	onEnterLobby: function(data) {
		this.join(lobbyId);
		io.in(lobbyId).emit("add slots", lobbySlots);
	},

	onHostGame: function(data) {
		console.log('client: ', this.id, ' host-game: ', data)
		lobbySlots[data.gameId].state = "settingup";
		this.gameId = data.gameId;
		broadcastSlotStateUpdate(data.gameId, "settingup");
	},

	onStageSelect: function(data) {
		lobbySlots[this.gameId].state = "joinable";
		lobbySlots[this.gameId].mapName = data.mapName;
		broadcastSlotStateUpdate(this.gameId, "joinable");
	},

	onEnterPendingGame: function(data) {
		var pendingGame = lobbySlots[data.gameId];
	
		this.leave(lobbyId);
		this.join(data.gameId);
	
		pendingGame.addPlayer(this.id);
		this.gameId = data.gameId;
	
		this.emit("show current players", {players: pendingGame.players});
		this.broadcast.to(data.gameId).emit("player joined", {id: this.id, color: pendingGame.players[this.id].color});
	
		if(pendingGame.getNumPlayers() >= MapInfo[pendingGame.mapName].spawnLocations.length) {
			pendingGame.state = "full";
			broadcastSlotStateUpdate(data.gameId, "full");
		}
	},

	onLeavePendingGame: function(data) {
		leavePendingGame.call(this);
	}
};

function broadcastSlotStateUpdate(gameId, newState) {
	io.in(lobbyId).emit("update slot", {gameId: gameId, newState: newState});
};

function leavePendingGame() {
	var lobbySlot = lobbySlots[this.gameId];

	this.leave(this.gameId);
	lobbySlot.removePlayer(this.id);
	io.in(this.gameId).emit("player left", {players: lobbySlot.players});

	if(lobbySlot.getNumPlayers()== 0) {
		lobbySlot.state = "empty";
		io.in(lobbyId).emit("update slot", {gameId: this.gameId, newState: "empty"});
	}

	if(lobbySlot.state == "full") {
		lobbySlot.state = "joinable";
		io.in(lobbyId).emit("update slot", {gameId: this.gameId, newState: "joinable"});
	}
};

module.exports = Lobby;