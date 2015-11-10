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
        this.ws.send(JSON.stringify({
            command: 'validateword',
            word: word,
            gameId: this.gameId
        }));
    },

    onMessage: function (json) {
        switch (json.command) {
            case 'validateword':
                this.addWordToList(json);
                break;
        }
    },

    addWordToList: function (json) {
        $('#wordList').prepend(
            '<div class="item">' +
                '<i class="green checkmark icon"></i>' +
                '<div class="content">' +
                    json.word +
                '</div>' +
            '</div>');
    }
});
