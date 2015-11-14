C.Player = C.Class.extend({
    options: {
        name: 'Unknown',
        server: 'ws://localhost:8080'
    },

    initialize: function (options) {
        options = C.setOptions(this, options);
        options.server = this.getParameterByName('server') || options.server;
        this.ws = new WebSocket(options.server);
        this.ws.onmessage = C.bind(this.onMessage, this);
        this.ws.onclose = function () {throw new Error('The server crashed');};
        this.uuid = this.generateUuid();
        this.promptLoginDialog();
        this.game = new C.Game(this.ws, this);
    },

    // Generates a UUID as per http://www.ietf.org/rfc/rfc4122.txt.
    generateUuid: function() {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
                function(c) {
                    var r = (d + Math.random() * 16) % 16 | 0;
                    d = Math.floor(d/16);
                    return (c=='x' ? r : (r&0x3 | 0x8)).toString(16);
        });
        return uuid;
    },

    getParameterByName: function (name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : results[1].replace(/\+/g, " ");
    },

    promptLoginDialog: function () {
        $('#loginDialog').modal({
            closable: false,
            onApprove: C.bind(this.onNameModalSelect, this)
        }).modal('show');
    },

    onNameModalSelect: function (e) {
        this.name = $('#playerNameInput').val();
        this.name = this.name === '' ? this.options.name : this.name;
        this.ws.send(JSON.stringify({
            command: 'setname',
            name: this.name,
            uuid: this.uuid
        }));
    },

    onNameInput: function (e) {
        if (e.keyCode === 13) {
            // enter
            $('.ui.modal').modal('hide');
            this.name = $('#playerNameInput').val();
            this.name = this.name === '' ? this.options.name : this.name;
            this.ws.send(JSON.stringify({
                command: 'setname',
                name: this.name,
                uuid: this.uuid
            }));
        }
    },

    onWordInput: function (e) {
        if (e.keyCode === 13) {
            // enter
            var word = $('#newWord').val();
            // clear the input
            $('#newWord').val('');
            this.game.validateWord(word);
        }
    },

    onStartSinglePlayer: function () {
        this.ws.send(JSON.stringify({
            command: 'startgame',
            uuid: this.uuid,
            gameId: this.game.gameId
        }));
    },

    onMessage: function (msg) {
        msg = JSON.parse(msg.data);
        switch (msg.command) {
            case 'forcequit':
                this.forceQuit();
                break;
            case 'playerlist':
                this.showPlayers(msg.players, msg.gameRooms);
                break;
            case 'startsession':
                this.game.startGame(msg);
                break;
            case 'validateword':
                this.game.onMessage(msg);
                break;
        }
    },

    showPlayers: function (players, gameRooms) {
        $('#players').empty();
        players.forEach(function(player) {
            $('#players').append(
                '<div class="ui segment">' +
                '   <p><i class="spy icon"></i>' + player.name + '</p>' +
                '</div>');
        });
        $('#gameRooms').empty();
        $('#addGameRoomBtn').removeClass('disabled');
        gameRooms.forEach(C.bind(function(gameRoom) {
            var gameRoomPlayers = '<div class="ui bulleted list">';
            gameRoom.players.forEach(C.bind(function(player) {
                var leaveRoomButton = '';
                if (player.uuid === this.uuid) {
                    // We are in this gameroom.
                    $('#addGameRoomBtn').addClass('disabled');
                    this.game.gameId = gameRoom.gameId;
                    leaveRoomButton = '<a onclick="C.player.onGameRoomLeave(\'' + gameRoom.gameId + '\')">' +
                                          '<i class="black remove user icon"></i>' +
                                      '</a>';
                }
                gameRoomPlayers += '<div class="item">' + leaveRoomButton + player.name + '</div>';
            }, this));
            gameRoomPlayers += '</div>';
            var gameRoomSegment = '<div class="ui segment">' +
                  '<button class="fluid ui button" onclick="C.player.onGameRoomJoin(\'' + gameRoom.gameId + '\')">' +
                        '<i class="add user icon"></i>' +
                        gameRoom.name +
                  '</button>';
            gameRoomSegment += gameRoomPlayers;
            gameRoomSegment += '</div>';
            $('#gameRooms').append(gameRoomSegment);
        }, this));
    },

    onGameRoomJoin: function (gameId) {
        this.ws.send(JSON.stringify({
            command: 'joingameroom',
            gameId: gameId,
            uuid: this.uuid
        }));
    },

    onGameRoomLeave: function (gameId) {
        this.ws.send(JSON.stringify({
            command: 'leavegameroom',
            gameId: gameId,
            uuid: this.uuid
        }));
    },

    addNewGameRoom: function () {
        $('#newGameRoomDialog').modal({
            closable: false,
            onApprove: C.bind(this.onGameRoomNameSelect, this)
        }).modal('show');
    },

    onGameRoomNameSelect: function (e) {
        if (e && e.keyCode === 13) {
            // enter
            var gameName = $('#gameRoomInput').val();
            $('.ui.modal').modal('hide');
            this.ws.send(JSON.stringify({
                command: 'creategameroom',
                name: gameName,
                uuid: this.uuid
            }));
        }
        else if (!e.keyCode) {
            var gameName = $('#gameRoomInput').val();
            this.ws.send(JSON.stringify({
                command: 'creategameroom',
                name: gameName,
                uuid: this.uuid
            }));
        }
    },

    forceQuit: function () {
        this.game.endGame();
        this.game.gameId = undefined;
        $('#wordList').empty();
    }
});
