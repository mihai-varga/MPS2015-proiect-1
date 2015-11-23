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

// Increments current round.
Player.prototype.updateRound = function() {
    this.round++;
}

module.exports = Player;
