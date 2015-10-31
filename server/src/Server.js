var WebSocketServer = require('ws').Server
    , wss = new WebSocketServer({ port: 8080});

var clientId = 0; // change this to a UUID
wss.on('connection', function connection(ws) {
    var thisId = ++clientId;
    console.log('Client #%d connected.', thisId);

    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    });

    ws.send('something', function ack(error) {
        // TODO: Treat error.
    });

    ws.on('close', function() {
        console.log('Client #%d has disconnected.', thisId);
    });
});
