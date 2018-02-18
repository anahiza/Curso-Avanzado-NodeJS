'use strict'

const http = require('http')
const debug = require('debug')('platziverse:web')
const express = require('express')
const chalk = require('chalk')
const port = process.env.PORT || 8080
const path = require('path')
const socketio = require('socket.io')
const PlatziverseAgent = require('platziverse-agent')
const { pipe } = require('./utils')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const agent = new PlatziverseAgent()

app.use(express.static(path.join(__dirname, 'public')))
// Socket io

io.on('connect', socket => {
  debug(`Connected ${socket.id}`)

  pipe(agent, socket)
})

server.listen(port, () => {
  console.log(`${chalk.green('[platziverse-web]')} server listening on port ${port}`)
  agent.connect()
})

process.on('uncaughtException', handleFatalError)
process.on('unhandledRejection', handleFatalError)

function handleFatalError (err) {
  console.log(`${chalk.red('[fatal error]')} ${err.message}`)
  console.log(err.stack)
  process.exit(1)
}
