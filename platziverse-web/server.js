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
const proxy = require('./proxy')
const asyncify = require('express-asyncify')

const app = asyncify(express())
const server = http.createServer(app)
const io = socketio(server)

const agent = new PlatziverseAgent()

app.use(express.static(path.join(__dirname, 'public')))
app.use('/', proxy)
// Socket io

io.on('connect', socket => {
  debug(`Connected ${socket.id}`)
  console.log(`Connected ${socket.id} and ${agent._agentId}`)

  pipe(agent, socket)
})

app.use((err, req, res, next) => {
  debug(`Error: ${err.message}`)
  if (err.message.match(/not found/)) {
    return res.status(404).send({ error: err.message })
  }
  res.status(500).send({error: err.message})
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
