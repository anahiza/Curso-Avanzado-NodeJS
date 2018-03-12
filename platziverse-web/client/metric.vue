<template>
  <div class="metric">
    <h3 class="metric-type">{{ type }}</h3>
    <line-chart
      :chart-data="datacollection"
      :options="{ responsive: true }"
      :width="400" :height="200"
    ></line-chart>
    <p v-if="error">{{error}}</p>
  </div>
</template>
<style>
  .metric {
    border: 1px solid white;
    margin: 0 auto;
  }
  .metric-type {
    font-size: 28px;
    font-weight: normal;
    font-family: 'Roboto', sans-serif;
  }
  canvas {
    margin: 0 auto;
  }
</style>
<script>
const request = require('request-promise-native')
const moment = require('moment')
const randomColor = require('random-material-color')
const LineChart = require('./line-chart')

module.exports = {
  name: 'metric',
  components: {
    LineChart
  },
  props: [ 'uuid', 'type', 'socket'],

  data() {
    return {
      datacollection: {},
      error: null,
      color: null
    }
  },

  mounted() {
    this.initialize()
  },

  methods: {
    async initialize() {
      const { uuid, type } = this
      console.log(`UUID: ${uuid} and ${type}`)
      this.color = randomColor.getColor()
      const options = {
        method: 'GET',
        url: `http://localhost:8080/metrics/${uuid}/${type}`,
        json: true
      }
      console.log(options)

      let result
      try {
        result = await request(options)
      } catch (error) {
        this.error = error.error.error
        return 
      }

      const labels = []
      const data = []

      if (Array.isArray(result)){
        result.forEach(m => {
          console.log(m)
          labels.push(moment(m.createdAt).format("HH:mm:ss"))
          data.push(m.value)
          console.log(data)
        })
      }
      this.datacollection = {
        labels,
        datasets: [{
          backgroundColor: this.color,
          label: type,
          data
        }]
      }

      this.startRealtime()
    },

    startRealtime() {
      const { type, uuid, socket } = this
      console.log(type, uuid, socket)
      socket.on('agent/message', payload => {
        console.log(payload)
        if(payload.agent.uuid === uuid){
          const metric = payload.metrics.find(m => m.type === type)

          //copy current values
          const labels = this.datacollection.labels
          const data = this.datacollection.datasets[0].data
          
          const length = labels.length || data.length
          if (length >= 20){
            labels.shift()
            data.shift()

          }

          labels.push(moment(metric.createdAt).format('HH:mm:ss'))
          data.push(metric.value)
          this.datacollection = {
            labels,
            datasets: [{
              backgroundColor: this.color,
              label: type,
              data
            }]
          }
        }
      })
    },

    handleError (err) {
      this.error = err.message
    }
  }
}
</script>
