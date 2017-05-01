const http = require('http');
const https = require('https');
const fs = require('fs')
const config = require('../../../config.js')


if(config.cert){
  const privateKey = fs.readFileSync(config.cert.key)
  const certificate = fs.readFileSync(config.cert.cert)

  const credentials = {key: privateKey, cert: certificate}

  module.exports = https.createServer(credentials)
} else {
  module.exports = http.createServer()
}



// // getServer
// module.exports = app => {
//   if(server)
//     return server
//   server = https.createServer(app)
//   return server
// }