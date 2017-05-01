const http = require('http');
const crypto = require('crypto')
const fs = require('fs')
const config = require('../../../config.js')

const server = http.createServer()

if(config.cert){
  const privateKey = fs.readFileSync(config.cert.key).toString();
  const certificate = fs.readFileSync(config.cert.cert).toString();

  const credentials = crypto.createCredentials({key: privateKey, cert: certificate});

  server.setSecure(credentials)
}

module.exports = server