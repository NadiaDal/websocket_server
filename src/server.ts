import * as process from 'process';
import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import {AddressInfo} from 'node:net'
import AutomergeStore from './automerge';
import {Action, InitMessage, Message} from './types';

const app = express();

const TEAM_ID = 'awesome_team';
const storage = require('node-persist');

const initWebsocketServer = async () => {
    await storage.init();

    const automerge = await storage.getItem(TEAM_ID);
    AutomergeStore.restore(automerge);
    const httpServer = http.createServer(app);
    const websocketServer = new WebSocket.Server({server: httpServer});

    httpServer.listen(process.env.PORT || 8999, () => {
        console.log(`Server started on port ${(httpServer.address() as AddressInfo).port} :)`);
        console.log('initWebsocketServer', AutomergeStore.items);
    });

    return websocketServer;
}

initWebsocketServer().then(webSocketServer => {

    webSocketServer.on('connection', (webSocket: WebSocket) => {

        webSocket.on('message', (buffer: Buffer) => {

            const message = JSON.parse(buffer.toString('utf8')) as Message;

            console.log(message);

            switch (message.action) {
                case Action.INIT: {
                    // apply history from user to server history
                    AutomergeStore.applyChanges(message.payload);
                    console.log('INIT: ', AutomergeStore.items);
                    // send back server history merged with user history
                    const serverChanges = AutomergeStore.allChanges();
                    if (serverChanges) {
                        const msg: InitMessage = {
                            team: message.team,
                            action: Action.INIT,
                            payload: JSON.stringify(serverChanges)
                        };
                        webSocketServer.clients
                            .forEach(client => {
                                client.send(JSON.stringify(msg));
                            });
                    }
                    break;
                }
                case Action.CHANGES: {
                    AutomergeStore.applyChanges(message.payload);

                    console.log('CHANGES: ', AutomergeStore.items);
                    webSocketServer.clients
                        .forEach(client => {
                            if (client != webSocket) {
                                client.send(JSON.stringify(message));
                            }
                        });
                    break;
                }
            }
        });
    });
})

if (process.platform === "win32") {
    var rl = require("readline").createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.on("SIGINT", function () {
        // @ts-ignore
        return process.emit("SIGINT");
    });
}

process.on('SIGINT', () => {
    storage.setItem(TEAM_ID, AutomergeStore.persist()).then((meta: unknown) => {
        console.log(meta);
        process.exit();
    });
});
