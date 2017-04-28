const Rx = require('rx')
const Lien = require("lien");
const uuid = require('uuid/v4');

const source$ = new Rx.Subject()

const PORT = 3000 //TODO: move to config

let server = new Lien({
    host: "localhost",
    port: PORT
});

server.on("load", err => {
    console.log(err || `Server started on port ${PORT}.`);
    err && process.exit(1);
});

server.addPage("/", lien => {
  const endpoint = uuid();

  server.addPage("/" + endpoint, "post", l => {
    source$.onNext(l.req.body)
    l.end("Got it!")
  })

  lien.end("Added enpoint at " + endpoint)
})

module.exports = source$

source$
  .subscribe(console.log)