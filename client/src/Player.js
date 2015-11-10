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
        this.promptLoginDialog();
    },

    getParameterByName: function (name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : results[1].replace(/\+/g, " ");
    },

    promptLoginDialog: function () {
        $('.ui.modal').modal({
            closable: false,
            onApprove: C.bind(this.onNameModalSelect, this)
        }).modal('show');
    },

    onNameModalSelect: function (e) {
        this.name = $('#playerNameInput').value;
        this.name = this.name === '' ? this.options.name : this.name;
    },

    onNameInput: function (e) {
        if (e.keyCode === 13) {
            // enter
            $('.ui.modal').modal('hide');
            this.name = $('#playerNameInput').value;
            this.name = this.name === '' ? this.options.name : this.name;
            console.log(this.name);
        }
    },

    onWordInput: function (e) {
        if (e.keyCode === 13) {
            // enter
            var word = $('#newWord').value;
            // clear the input
            $('#newWord').val('');
            this.game.validateWord(word);
        }
    },

    onStartSinglePlayer: function () {
        this.game = new C.Game(this.ws);
        this.ws.send(JSON.stringify({
            command: 'startgame'
        }));
    },

    onMessage: function (msg) {
        msg = JSON.parse(msg.data);
        switch (msg.command) {
            case 'validateword':
                this.game.onMessage(msg);
                break;
        }
    }
});
