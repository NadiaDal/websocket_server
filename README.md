### Websocket server

It is a very basic implementation of a WebSocket server.
It stores in memory an up-to-date copy of an items list.

[Automerge](https://github.com/automerge/automerge) is chosen as a library for building collaborative applications.
It is supposed to solve the problem of merging non conflicted data received from multiple clients.

### What to improve
Add a non-relational database for storing data if the server goes down

Add scaling per team. Store separate instances of auto-merge store for each team

Add tests

### How to run
- clone repository `git clone <REPO>`
- install dependencies `npm install`
- compile project `npm run compile`
- run server `npm run dev`
