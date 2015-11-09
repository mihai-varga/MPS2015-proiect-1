C.Player = C.Class.extend({
    options: {
        name: 'Unknown',
        server: 'ws://localhost:8080'
    },

    initialize: function (options) {
        options = C.setOptions(this, options);
        this.ws = new WebSocket(options.server);
        this.ws.onmessage = C.bind(this.onMessage, this);
        this.ws.onclose = function () {throw new Error('The server crashed');};
        this.promptLoginDialog();
    },

    promptLoginDialog: function () {
        $('.ui.modal').modal({
            closable: false,
            onApprove: C.bind(this.onNameModalSelect, this)
        }).modal('show');
    },

    onNameModalSelect: function (e) {
        this.name = document.getElementById('playerNameInput').value;
        this.name = this.name === '' ? this.options.name : this.name;
    },

    onNameInput: function (e) {
        if (e.keyCode === 13) {
            // enter
            $('.ui.modal').modal('hide');
            this.name = document.getElementById('playerNameInput').value;
            this.name = this.name === '' ? this.options.name : this.name;
            console.log(this.name);
        }
    },

    onStartSinglePlayer: function () {
        this.ws.send(JSON.stringify({
            command: 'startgame'
        }));
    },

    onMessage: function (msg) {
        msg = msg.data;
        console.log(msg);
    }
});
