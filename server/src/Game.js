function Game() {
    // List of users playing in the current game. Can contain one or more
    // users (if the game is multiplayer).
    this.userList = [];
    // Game's name, by default = 'FatCat'.
    this.gameRoomName = 'FatCat';
    this.timeout = 1 * 60 * 1000 + 1 * 1000; // 1 minute + 1s
    this.id = this.generateUuid();
    this.usedWords = {};
}

// Add a new player to this game.
Game.prototype.addPlayer = function(player) {
    this.userList.push(player);
}

Game.prototype.gameBroadcast = function(msg) {
    for (var i = 0; i < this.userList.length; i++) {
        this.userList[i].ws.send(JSON.stringify(msg));
    }
}

// Starts a new game session for each connected user and then sets the timeout
// to end this session.
Game.prototype.startSession = function() {
    for (var i = 0; i < this.userList.length; i++) {
        this.userList[i].ws.send(JSON.stringify({
            command : 'startsession',
            id: this.id
        }));
    }
    setTimeout(this.endSession.bind(this), this.timeout);
}


// Ends the current session by notifying each of the connected users.
Game.prototype.endSession = function() {
    for (var i = 0; i < this.userList.length; i++) {
        this.userList[i].ws.send(JSON.stringify({
            command : 'endsession',
            id: this.id
        }));
    }
}

// Generates a UUID as per http://www.ietf.org/rfc/rfc4122.txt.
Player.prototype.generateUuid = function() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
            function(c) {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d/16);
                return (c=='x' ? r : (r&0x3 | 0x8)).toString(16);
    });
    return uuid;
}

// Handles a new word inputed by the player
Player.prototype.handleWord = function(json) {
    // return the initial json with some modified properties
    var isValidWord = Math.random() > 0.5; // TODO - check the dictionary
    json.valid = isValidWord && !this.usedWords[json.word];
    if (json.valid) {
        usedWords[json.word] = true;
    }
    this.gameBroadcast(json);
}
