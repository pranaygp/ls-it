const Rx = require('rx')
const Lien = require("lien");
const uuid = require('uuid/v4');
const jsonfile = require('jsonfile')
const path = require('path')

const event = require('../event')
const config = require('../../../config')

const ALIAS_FILE = path.join(__dirname, '../../../webhooks-alias.json')

let server = new Lien({
    host: "0.0.0.0",  // DigitalOcean can't use anything else
    port: config.PORT || 3000
});

const Source$ = new Rx.Subject()

const aliases = jsonfile.readFileSync(ALIAS_FILE)

const addEndpoint = (endpoint, alias) => {
  server.addPage("/" + endpoint, "post", l => {
    Source$.onNext(event("webhooks", { data: l.req.body, endpoint, alias}))
    l.end("Got it!")
  })
  console.log(`Created endpoint at: ${endpoint} alias to ${alias}`)
}

aliases.forEach(([endpoint, alias]) => {
  addEndpoint(endpoint, alias)
})

server.on("load", err => {
    console.log(err || `Server started on port ${PORT}.`);
    err && process.exit(1);
});

server.addPage("/gen", "post", lien => {
  if(!lien.req.body.alias){
    lien.end(`Missing "alias" string in POST request`)
    return;
  }
  if(aliases.map(x => x[1]).indexOf(lien.req.body.alias) > -1){
    lien.end(`Duplicate "alias". Maybe try "${lien.req.body.alias}-2"`)
    return;
  }
  const endpoint = uuid();
  aliases.push([endpoint, lien.req.body.alias])
  jsonfile.writeFile(ALIAS_FILE, aliases)
  
  addEndpoint(endpoint, lien.req.body.alias)

  lien.end("Added enpoint at " + endpoint)
})

module.exports = Source$.asObservable()