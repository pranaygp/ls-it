const Rx = require('rx')
const micro = require('micro')

const source = new Rx.Subject()

const PORT = 3000 //TODO: move to config

const server = micro(async req => {
  source.onNext(await micro.json(req))
  return 'Got Data'
})

server.listen(PORT)

module.exports = source