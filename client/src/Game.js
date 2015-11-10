C.Game = C.Class.extend({
    options: {
        name: 'Single player game'
    },

    initialize: function (ws, options) {
        options = C.setOptions(this, options);
        this.gameId = options.gameId;
        this.ws = ws;
        this.score = 0;
        // clear the word list;
        $('#wordList').empty();
    },

    validateWord: function (word) {
        console.log(this.gameId);
        this.ws.send(JSON.stringify({
            command: 'validateword',
            word: word,
            gameId: this.gameId
        }));
    },

    onMessage: function (json) {
        console.log(json);
    }
});
