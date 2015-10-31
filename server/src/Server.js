var WebSocketServer = require('ws').Server
    , wss = new WebSocketServer({ port: 8080});

wss.on('connection', function connection(ws) {
    var newClient = new Player(ws);

    console.log('Client #%s, %s connected.', newClient.uuid, newClient.name);

    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    });

    ws.send('something', function ack(error) {
        // TODO: Treat error.
    });

    ws.on('close', function() {
        // TODO: Add code here.
    });
});
