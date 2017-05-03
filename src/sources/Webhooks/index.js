const Rx = require('rxjs/Rx')
const server = require('./server')
const uuid = require('uuid/v4');
const jsonfile = require('jsonfile')
const path = require('path')

const app = require('./expressApp')
const event = require('../event')
const config = require('../../../config')

const ALIAS_FILE = path.join(__dirname, '../../../webhooks-alias.json')
const PORT = config.port || 3000


const Source$ = new Rx.Subject()

const aliases = jsonfile.readFileSync(ALIAS_FILE)

const addEndpoint = (endpoint, alias) => {
  app.post("/" + endpoint,  (req, res) => {
    Source$.next(event("webhooks", { data: req.body, endpoint, alias}))

    res.send("Got it!")
  })
  console.log(`Created endpoint at: ${endpoint} alias to ${alias}`)
}

aliases.forEach(([endpoint, alias]) => {
  addEndpoint(endpoint, alias)
})

app.post("/gen", (req, res) => {

  if(!req.body.alias){
    res.send(`Missing "alias" string in POST request`)
    return;
  }
  if(aliases.map(x => x[1]).indexOf(req.body.alias) > -1){
    res.send(`Duplicate "alias". Maybe try "${req.body.alias}-2"`)
    return;
  }
  const endpoint = uuid();
  aliases.push([endpoint, req.body.alias])
  jsonfile.writeFile(ALIAS_FILE, aliases)
  
  addEndpoint(endpoint, req.body.alias)

  res.send("Added enpoint at " + endpoint)
})


server
  .on('request', app)

server  
  .listen(PORT, () => {
    console.log(`Server started on port ${PORT}.`);
  })

module.exports = Source$