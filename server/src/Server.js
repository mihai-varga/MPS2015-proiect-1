var WebSocketServer = require('ws').Server
    , wss = new WebSocketServer({ port: 8080});

// A key-value dictionary to keep track of the connected clients. The key will
// be the web socket the client is using to communicate with the server.
var allPlayers = {};

wss.on('connection', function connection(ws) {
    // Add a new player to the dictionary.
    allPlayers[ws] = new Player(ws);
    console.log('Client %s connected.', allPlayers[ws].name);

    ws.on('message', function incoming(message) {
        console.log('received: %s from %s', message, allPlayers[ws].name);
    });

    ws.send('something', function ack(error) {
        // TODO: Treat error.
    });

    ws.on('close', function() {
        // Disconnecting a client means deleting the client's entry from the
        // dictionary.
        console.log('Client %s disconnected.', allPlayers[ws].name);
        delete allPlayers[ws];
    });
});
