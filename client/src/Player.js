C.Player = C.Class.extend({
    options: {
        name: 'Uknown'
    },

    initialize: function (options) {
        options = C.setOptions(this, options);
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
    }
});
