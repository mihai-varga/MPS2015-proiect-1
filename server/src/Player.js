function Player(ws) {
    // The web socket this client is using.
    this.ws = ws;
    // The client's UUID.
    this.uuid = this.generateUuid();
    // Client's name, by default = 'FatCat'.
    this.name = 'FatCat';
    // Client's current score.
    this.score = 0;
    // Client's round. Always start at first round.
    this.round = 1;
}

// Will set this client's initial dices.
Player.prototype.setDice = function(dices) {
    this.dice = dice;
}

// Will update the client's score, based on the word the client has provided.
Player.prototype.computeScore = function(word) {
    // TODO: add implementation here
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

// Increments current round.
Player.prototype.updateRound = function() {
    this.round++;
}

module.exports = Player;
