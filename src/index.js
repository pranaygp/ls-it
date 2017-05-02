const Rx = require('rxjs/Rx')
const _ = require('lodash')
const path= require('path')
const WebSocket = require('ws');
const jsonfile = require('jsonfile')

const server = require('./sources/Webhooks/server')
const expressApp = require('./sources/Webhooks/expressApp')
const reducer = require('./reducer')
const Sources = require('./sources')

const TODO_LIST_FILE = path.join(__dirname, '../todo-list.json')

const wss = new WebSocket.Server({ 
  server: server
});
console.log("Webscokets Broadcasting")

// Monkeypatch broadcast to all.
wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

let currentList = jsonfile.readFileSync(TODO_LIST_FILE)
Rx.Observable
  .merge(_.map(Sources, _.identity))
  .scan(reducer, currentList)                  // gives us redux style state management
  .distinctUntilChanged()
  .do(list => currentList = list) // HACK: side effect to store list for incoming client connections
  .do(list => jsonfile.writeFile(TODO_LIST_FILE, list))
  .subscribe(list => {
    wss.broadcast(JSON.stringify(list))
  })

wss.on('connection', client => {
  if (client.readyState === WebSocket.OPEN) {
    client.send(JSON.stringify(currentList));
  }
})

expressApp
  .get('/list', (req, res) => {
    res.send(currentList)
  })