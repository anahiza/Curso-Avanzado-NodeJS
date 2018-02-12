'use strict'

const http = require('http')
const debug = require('debug')('platziverse:web')
const express = require('express')
const chalk = require('chalk')
const port = process.env.PORT || 8080
const path = require('path')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

app.use(express.static(path.join(__dirname, 'public')))
// Socket io

io.on('connect', socket => {
  debug(`Connected ${socket.id}`)
  socket.on('agent/message', payload => {
    console.log(payload)
  })

  setInterval(() => {
      socket.emit('agent/message', {agent: 'xxx-yyy'})
  }, 2000)
})


server.listen(port, () => {
  console.log(`${chalk.green('[platziverse-web]')} server listening on port ${port}`)
})

process.on('uncaughtException', handleFatalError)
process.on('unhandledRejection', handleFatalError)

function handleFatalError (err) {
  console.log(`${chalk.red('[fatal error]')} ${err.message}`)
  console.log(err.stack)
  process.exit(1)
}
