var WebSocketServer = require('ws').Server
    , wss = new WebSocketServer({ port: 8080});

// A key-value dictionary to keep track of the connected clients. The key will
// be the web socket the client is using to communicate with the server.
var allPlayers = {};
var allGames = {};

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        var json = JSON.parse(message);
        switch (json.command) {
            case 'setname':
                // Register a new player.
                var player = new Player(ws);
                player.name = json.name;
                player.uuid = json.uuid;
                allPlayers[player.uuid] = player;
                broadcastPlayers();
                break;
            case 'startgame':
                if (!json.gameId) {
                    // we have a single player game
                    var newGame = new Game('singleplayer');
                    newGame.addPlayer(allPlayers[json.uuid]);
                    newGame.startSession();
                    allGames[newGame.gameId] = newGame;
                }
                else {
                    allGames[json.gameId].startSession();
                }
                break;
            case 'validateword':
                allGames[json.gameId].validateWord(json);
                break;
        }
    });

    ws.on('close', function() {
        // Disconnecting a client means deleting the client's entry from the
        // dictionary.
    });
});

function broadcastPlayers() {
    var players = [];
    for (var uuid in allPlayers) {
        var player = allPlayers[uuid];
        players.push({
            uuid: player.uuid,
            name: player.name
        });
    }
    for (var uuid in allPlayers) {
        var ws = allPlayers[uuid].ws;
        ws.send(JSON.stringify({
            command: 'playerlist',
            players: players
        }));
    }
}
