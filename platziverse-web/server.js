'use strict'

const http = require('http')
const debug = require('debug')('platziverse:web')
const express = require('express')
const chalk = require('chalk')
const port = process.env.PORT || 8080
const path = require('path')

const app = express()
const server = http.createServer(app)

app.use(express.static(path.join(__dirname, 'public')))

process.on('uncaughtException', handleFatalError)
process.on('unhandledRejection', handleFatalError)

server.listen(port, () => {
  console.log(`${chalk.green('[platziverse-web]')} server listening on port ${port}`)
})

function handleFatalError (err) {
  console.log(`${chalk.red('[fatal error]')} ${err.message}`)
  console.log(err.stack)
  process.exit(1)
}
