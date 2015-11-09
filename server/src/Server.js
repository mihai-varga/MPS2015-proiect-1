var WebSocketServer = require('ws').Server
    , wss = new WebSocketServer({ port: 8080});

// A key-value dictionary to keep track of the connected clients. The key will
// be the web socket the client is using to communicate with the server.
var allPlayers = {};
var allGames = {};

wss.on('connection', function connection(ws) {
    // Add a new player to the dictionary.
    allPlayers[ws] = new Player(ws);
    console.log(allPlayers[ws].uuid);

    ws.on('message', function incoming(message) {
        var json = JSON.parse(message);
        switch (json.command) {
            case 'setname':
                // Change name of the current player.
                allPlayers[ws].name = json.name;
                break;
            case 'startgame':
                var newGame = new Game();
                newGame.addPlayer(allPlayers[ws]);
                newGame.startSession();
                allGames[newGame.id] = newGame;
                break;
            case 'validateword':
                allGames[json.gameId].validateWord(json);
                break;
        }
    });

    ws.send('something', function ack(error) {
        // TODO: Treat error.
    });

    ws.on('close', function() {
        // Disconnecting a client means deleting the client's entry from the
        // dictionary.
        delete allPlayers[ws];
    });
});
