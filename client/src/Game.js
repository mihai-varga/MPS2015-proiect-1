C.Game = C.Class.extend({
    options: {
        name: 'Single player game'
    },

    initialize: function (ws, player, options) {
        this.ws = ws;
        this.player = player;
    },

    startGame: function (json) {
        this.score = 0;
        this.gameId = json.gameId;
        // timeout in ms
        this.timeout = json.timeout;
        // clear the word list;
        $('#wordList').empty();
        $('#newWordDiv').removeClass('disabled');
        $('#newWord').focus();
        $('#startSinglePlayer').addClass('disabled');
        this.startTimer(this.timeout / 1000);
    },

    validateWord: function (word) {
        this.ws.send(JSON.stringify({
            command: 'validateword',
            word: word,
            gameId: this.gameId,
            uuid: this.player.uuid
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
        if (json.uuid !== this.player.uuid) {
            var icon = 'user icon';
        } else if (json.valid) {
            icon = 'green checkmark icon';
        } else {
            icon = 'red minus circle icon';
        }
        $('#wordList').prepend(
            '<div class="item">' +
                '<i class="' + icon + '"></i>' +
                '<div class="content">' +
                    json.word +
                '</div>' +
            '</div>');
    },

    startTimer: function (duration) {
        var start = Date.now(),
            diff,
            minutes,
            seconds;
        var interval;
        var timer = C.bind(function () {
            // get the number of seconds that have elapsed since
            // startTimer() was called
            diff = duration - (((Date.now() - start) / 1000) | 0);

            // does the same job as parseInt truncates the float
            minutes = (diff / 60) | 0;
            seconds = (diff % 60) | 0;

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            $('#timer').text(minutes + ':' + seconds);

            if (diff <= 0) {
                clearInterval(interval);
                this.endGame();
            }
        }, this);
        // we don't want to wait a full second before the timer starts
        timer();
        interval = setInterval(timer, 1000);
    },

    endGame: function () {
        $('#newWordDiv').addClass('disabled');
        $('#newWord').blur();
        $('#startSinglePlayer').removeClass('disabled');

    }
});
