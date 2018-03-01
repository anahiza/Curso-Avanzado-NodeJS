<template>
  <div>
    <agent uuid="yyy"></agent>
    <metric type="promiseMetric" 
      uuid="aa5b780b-a213-4438-9f3e-06e624017ddb"
      :socket="socket">
      
      </metric>
    <agent
      v-for="agent in agents"
      :uuid="agent.uuid"
      :key="agent.uuid">
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
    initialize () {
    }
  }
}
</script>
