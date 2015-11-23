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
        var d_r = json.dicesRolled;
        // clear the word list;
        $('#wordList').empty();
        $('#newWordDiv').removeClass('disabled');
        $('#newWord').focus();
        $('#startSinglePlayer').addClass('disabled');
        $('#score').text(0);

        /* Iterate throught all dices and show the rolled letters*/
        var s="zar", zar_c, aux;
        for(var i=1;i<=9;++i) {
            aux=s+i;
            zar_c = document.getElementById(aux);
            zar_c.innerHTML = d_r[i-1];
        }

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
                if (json.uuid === this.uuid) {
                    $('#score').text(json.score);
                }
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
                this.endGame();
            }
        }, this);
        // we don't want to wait a full second before the timer starts
        timer();
        this.interval = setInterval(timer, 1000);
    },

    endGame: function () {
        clearInterval(this.interval);
        $('#timer').text('00:00');
        $('#newWordDiv').addClass('disabled');
        $('#newWord').blur();
        $('#startSinglePlayer').removeClass('disabled');
    }
});
