const Rx = require('rx')
const _ = require('lodash')
const WebSocket = require('ws');
const nodemailer = require('nodemailer');
const server = require('./sources/Webhooks/server')

const reducer = require('./reducer')
const Sources = require('./sources')

const config = require('../config')
const wss = new WebSocket.Server({ 
  // port: config.ws.port 
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

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.email.user,
    pass: config.email.pass
  }
});

function sendMail(subject, text) {
  const mailOptions = {
      from: '"Event Notifier" <noreply@gmail.com>',
      to: config.email.user,
      subject,
      text
    };

  transporter.sendMail(mailOptions, error => {
    if (error) {
      return console.log(error);
    }
    console.log('Email Message sent!');
  });
}

let currentList = []
Rx.Observable
  .merge(_.map(Sources, _.identity))
  .startWith([])
  .scan(reducer)                  // gives us redux style state management
  .distinctUntilChanged()
  .do(list => currentList = list) // HACK: side effect to store list for incoming client connections
  .subscribe(list => {
    // sendMail("TODO list", list.map(entry => entry.item).join('\n'))
    wss.broadcast(JSON.stringify(list))
  })

  wss.on('connection', client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(currentList));
    }
  })