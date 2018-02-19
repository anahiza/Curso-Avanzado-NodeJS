'use strict'

const express = require('express')
const request = require('request-promise-native')
const asyncify = require('express-asyncify')

const api = asyncify(express.Router())
const { endpoint, apiToken } = require('./config')

api.get('/agents', async (req, res, next) => {
  const opts = {
    method: 'GET',
    url: `${endpoint}/api/agents`,
    headers: {
      'Authorization': `Bearer ${apiToken}`
    },
    json: true
  }
  let result
  try {
    result = await request(opts)
  } catch (error) {
    return next(error)
  }
  res.send(result)
})

api.get('/agent/:uuid', (req, res) => {

})

api.get('/metrics/:uuid', (req, res) => {

})

api.get('/metrics/:uuid/:type', (req, res) => {

})

module.exports = api
