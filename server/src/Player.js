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
	if (word.length < 4) {
		this.score = 0;
	}
	if (word.length > 3 && word.length < 10) {
		this.score = word.length;
	// BONUS: When the word's length is greater than 5, then the score will be
	// the length's square 
		if (word.length > 5) {
			this.score = word.length * word.length;
		}
	}
}

// Increments current round.
Player.prototype.updateRound = function() {
    this.round++;
}

module.exports = Player;
