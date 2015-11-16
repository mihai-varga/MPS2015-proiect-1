function Game(type, name) {
    // List of users playing in the current game. Can contain one or more
    // users (if the game is multiplayer).
    this.userList = [];
    // Game's name, by default = 'FatCat'.
    this.gameRoomName = 'FatCat';
    this.timeout = 1 * 15 * 1000; // 15 s
    this.gameId = this.generateUuid();
    //keeps the current letters from which the player creates words
    this.diceRoll = [];
    this.usedWords = {};
    this.type = type;
    this.name = name;
}

// Add a new player to this game.
Game.prototype.addPlayer = function(player) {
    this.userList.push(player);
}

// Remove a player from the game room
Game.prototype.removePlayer = function(uuid) {
    var index = -1;
    for (var i = 0; i < this.userList.length; i++) {
        if (this.userList[i].uuid === uuid) {
            index = i;
            break;
        }
    }
    if (index > -1) {
        this.userList.splice(index, 1);
    }
    allPlayers[uuid].ws.send(JSON.stringify({
        command: 'forcequit'
    }));
    if (this.owner === this.uuid) {
        // the game room owner left, at the end of the round we will
        // destory the room
        this.destory = true;
    }
    broadcastPlayers();
}

Game.prototype.gameBroadcast = function(msg) {
    this.userList.forEach(function(player) {
        player.ws.send(JSON.stringify(msg));
    });
}

// Starts a new game session for each connected user and then sets the timeout
// to end this session.
Game.prototype.startSession = function() {
    this.gameBroadcast({
        command : 'startsession',
        gameId: this.gameId,
        timeout: this.timeout
    });
    setTimeout(this.endSession.bind(this), this.timeout);
}


// Ends the current session by notifying each of the connected users.
Game.prototype.endSession = function() {
    this.gameBroadcast({
        command : 'endsession',
        gameId: this.gameId
    });
    if (this.destory) {
        this.gameBroadcast({
            command : 'forcequit'
        });
        this.userList = [];
        delete allGames[this.gameId];
    }
    broadcastPlayers();
}

// Generates a UUID as per http://www.ietf.org/rfc/rfc4122.txt.
Game.prototype.generateUuid = function() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
            function(c) {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d/16);
                return (c=='x' ? r : (r&0x3 | 0x8)).toString(16);
    });
    return uuid;
}

//Roll dice for current game
Game.prototype.getDiceRoll = function(){
    for(i = 0; i < 9; i ++){
        this.diceRoll[i] = dices[i][Math.floor(Math.random() * 6)];
    }
}

// Handles a new word inputed by the player
Game.prototype.validateWord = function(json) {
    // return the initial json with some modified properties
    var isValidWord = false;
    if (json.word in dictionary){
        var checkWord = (json.word).toUpperCase();
        for(int i = 0; i < 9; i ++){
            if(checkWord.indexOf(diceRoll[i]) > -1){
                checkWord = checkWord.replace(diceRoll[i], '');
            }
        }
	if(checkWord.length == 0){
            isValidWord = true;
        }
    }

    //var isValidWord = Math.random() > 0.5; // TODO - check the dictionary
    json.valid = isValidWord && !this.usedWords[json.word];
    if (json.valid) {
        this.usedWords[json.word] = true;
    }
    this.gameBroadcast(json);
}
