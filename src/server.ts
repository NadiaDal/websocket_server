import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import {AddressInfo} from 'node:net'
import AutomergeStore from './automerge';
import {Action, InitMessage, Message} from './types/websockets';

const app = express();

const httpServer = http.createServer(app);

const webSocketServer = new WebSocket.Server({server: httpServer});

webSocketServer.on('connection', (webSocket: WebSocket) => {

    webSocket.on('message', (buffer: Buffer) => {

        const message = JSON.parse(buffer.toString('utf8')) as Message;

        switch (message.action) {
            case Action.INIT: {
                // apply history from user to server history
                AutomergeStore.applyChanges(message.payload);
                // send back server history merged with user history
                const serverChanges = AutomergeStore.allChanges();
                if (serverChanges) {
                    const msg: InitMessage = {
                        team: message.team,
                        action: Action.INIT,
                        payload: JSON.stringify(serverChanges)
                    };
                    webSocket.send(JSON.stringify(msg));
                }
                break;
            }
            case Action.CHANGES: {
                AutomergeStore.applyChanges(message.payload);

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

httpServer.listen(process.env.PORT || 8999, () => {
    console.log(`Server started on port ${(httpServer.address() as AddressInfo).port} :)`);
});
