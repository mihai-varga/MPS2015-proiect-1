function Game() {
    // List of users playing in the current game. Can contain one or more
    // users (if the game is multiplayer).
    this.userList = [];
    // Game's name, by default = 'FatCat'.
    this.gameRoomName = 'FatCat';
    this.timeout = 1 * 60 * 1000 + 1 * 1000; // 1 minute + 1s
}

// Add a new player to this game.
Game.prototype.addPlayer = function(player) {
    this.userList.push(player);
}

// Starts a new game session for each connected user and then sets the timeout
// to end this session.
Game.prototype.startSession = function() {
    for (var i = 0; i < this.userList.length; i++) {
        this.userList[i].ws.send(JSON.stringify({
            command : 'startsession'
        }));
    }
    setTimeout(this.endSession.bind(this), this.timeout);
}


// Ends the current session by notifying each of the connected users.
Game.prototype.endSession = function() {
    for (var i = 0; i < this.userList.length; i++) {
        this.userList[i].ws.send(JSON.stringify({
            command : 'endsession'
        }));
    }
}
