function Player(ws) {
    // The web socket this client is using.
    this.ws = ws;
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

// Increments current round.
Player.prototype.updateRound = function() {
    this.round++;
}

module.exports = Player;
