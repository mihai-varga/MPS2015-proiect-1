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
            case 'creategameroom':
                var newGame = new Game('multiplayer', json.name);
                newGame.owner = json.uuid;
                newGame.addPlayer(allPlayers[json.uuid]);
                allGames[newGame.gameId] = newGame;
                broadcastPlayers();
                break;
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
        for (var uuid in allPlayers) {
            if (allPlayers[uuid].ws === ws) {
                // this player has disconnected
                delete allPlayers[uuid];

                // TODO - fix this part
                for (var gameId in allGames) {
                    var game = allGames[gameId];
                    if (game.owner === uuid) {
                        // TOOD - stop the current game
                        delete allGames[gameId];
                    }
                    else {
                        var index = -1;
                        for (var i = 0; i < game.userList.length; i++) {
                            if (game.userList[i].uuid == uuid) {
                                index = i;
                                break;
                            }
                        }
                        if (index > -1) {
                            game.userList.splice(index, 1);
                        }
                    }
                }
            }
        }
        broadcastPlayers();
    });
});

function broadcastPlayers() {
    var players = [];
    var gameRooms = [];
    var taken = {};
    for (var gameId in allGames) {
        var game = allGames[gameId];
        if (game.type === 'multiplayer') {
            var gameRoom = {
                name: game.name,
                gameId: game.gameId,
                players: []
            }
            game.userList.forEach(function (player) {
                gameRoom.players.push({
                    name: player.name,
                    uuid: player.uuid
                });
                taken[player.uuid] = true;
            });
            gameRooms.push(gameRoom);
        }
    }
    for (var uuid in allPlayers) {
        if (!taken[uuid]) {
            // this player does to belong to any game room
            var player = allPlayers[uuid];
            players.push({
                uuid: player.uuid,
                name: player.name
            });
        }
    }
    for (var uuid in allPlayers) {
        var ws = allPlayers[uuid].ws;
        ws.send(JSON.stringify({
            command: 'playerlist',
            players: players,
            gameRooms: gameRooms
        }));
    }
}
