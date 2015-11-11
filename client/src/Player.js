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
        $('.ui.modal').modal({
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
            uuid: this.uuid
        }));
    },

    onMessage: function (msg) {
        msg = JSON.parse(msg.data);
        switch (msg.command) {
            case 'startsession':
                this.game = new C.Game(this.ws, msg);
                break;
            case 'validateword':
                this.game.onMessage(msg);
                break;
        }
    }
});
