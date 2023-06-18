let WebSocket = require("ws")


function initWebSocket() {
    const ws = new WebSocket('ws://localhost:8080');


    ws.on('error', console.error);

    ws.on('open', function open() {
        ws.send('ping');
        receiveHeartBeat()
        this.pingInterval =  setInterval(function ping() {
            ws.send("hearbeat");
        }, 3000);
    });

    ws.on('message', function message(data) {
        console.log('received: %s', data);
        receiveHeartBeat();
    });

    ws.on('close', function clear() {
        console.log('closed');
        clearInterval(this.pingInterval);
        initWebSocket();
    })

    function receiveHeartBeat() {
        clearTimeout(this.pingTimeout);

        // Use `WebSocket#terminate()`, which immediately destroys the connection,
        // instead of `WebSocket#close()`, which waits for the close timer.
        // Delay should be equal to the interval at which your server
        // sends out pings plus a conservative assumption of the latency.
        this.pingTimeout = setTimeout(() => {
            this.terminate();

        }, 3000 + 5000);
    }
}

initWebSocket();