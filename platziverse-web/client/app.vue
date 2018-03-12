<template>
  <div>
    <agent
      v-for="agent in agents"
      :uuid="agent.uuid"
      :key="agent.uuid"
      :socket="socket">
    </agent>
    <p v-if="error">{{error}}</p>
  </div>
</template>

<style>
  body {
    font-family: Arial;
    background: #f8f8f8;
    margin: 0;
  }
</style>

<script>
const io = require('socket.io-client')
const socket = io()
const request = require('request-promise-native')

module.exports = {
  data () {
    return {
      agents: [],
      error: null,
      socket
    }
  },

  mounted () {
    this.initialize()
  },

  methods: {
    async initialize () {
      console.log('Inicializando app.vue')
      const options = {
        method: 'GET',
        url: 'http://localhost:8080/agents',
        json: true
      }
      let result
      try {
        result = await request(options)
        console.log("request app vue recibido Consultando Agentes")
      } catch (e) {
        console.log(e)
        this.error = e.error.error
        return
      }
      this.agents = result
      console.log(`Resultado request ${result}`)
      socket.on('agent/connected', payload => {
        const {uuid} = payload.agent
        const existing = this.agents.find(a => a.uuid === uuid)
        if (!existing){
          this.agents.push(payload.agent)
        }
      })
    }

  }
}
</script>
