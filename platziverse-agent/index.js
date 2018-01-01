'use strict'
const EventEmitter = require('events')

class PlatziverseAgent extends EventEmitter {
  constructor (opts) {
    super()
    this._started = false
    this._timer = null
    this._options = opts
  }

  connect () {
    if (!this._started) {
      this._started = true
      this.emit('connected')
      const opts = this._options
      this._timer = setInterval(() => {
        this.emit('agent/message', 'this is a message')
      }, opts.inverval)
    }
  }

  disconnect () {
    if (this._started) {
      clearInterval(this._timer)
      this._started = false
      this.emmit('disconnected')
    }
  }
}

module.exports = PlatziverseAgent
