'use strict'
const test = require('ava')
const request = require('supertest')
const sinon = require('sinon')
const proxyquire = require('proxyquire')
const agentFixtures = require('./fixtures/agent')
const auth = require('../auth')
const util = require('util')
const sign = util.promisify(auth.sign)
const config = require('../config')

let sandbox = null
let server = null
let dbStub = null
let AgentStub = {}
let MetricStub = {}
let uuid = 'yyy-yyy-yyy'
let token = null
let falsetoken = 'aaaaaaaaaaaaaa'
let wronguuid = 'aaa-aaa-aaa'

test.beforeEach(async () => {
  sandbox = sinon.sandbox.create()
  dbStub = sandbox.stub()
  dbStub.returns(Promise.resolve({
    Agent: AgentStub,
    Metric: MetricStub
  }))
  token = await sign({admin: true, username: 'platzi'}, config.auth.secret)

  AgentStub.findConnected = sandbox.stub()
  AgentStub.findConnected.returns(Promise.resolve(agentFixtures.connected))
  AgentStub.findByUuid = sandbox.stub()
  AgentStub.findByUuid.returns(Promise.resolve(agentFixtures.byUuid(uuid)))

  const api = proxyquire('../api', {
    'platziverse-db': dbStub
  })

  server = proxyquire('../server', {
    './api': api
  })
})

test.afterEach(async() => {
  sandbox && sinon.sandbox.restore()
})

test.serial.cb('/api/agent/:uuid', t => {
  request(server)
  .get(`/api/agent/${uuid}`)
  .set('Authorization', `Bearer ${token}`)
  .expect(200)
  .expect('Content-Type', /json/)
  .end((err, res) => {
    t.falsy(err, 'should not return an error')
    let body = JSON.stringify(res.body)
    let expected = JSON.stringify(agentFixtures.byUuid(uuid))
    t.deepEqual(body, expected, 'response body should be the expected')
    t.end()
  })
})

test.serial.cb('/api/agents - not authorized', t => {
  request(server)
  .get('/api/agents')
  .set('Authorization', `Bearer ${falsetoken}`)
  .expect(404)
  .expect('Content-Type', /json/)
  .end((err, res) => {
    t.truthy(err, 'should return an error')
    t.end()
  })
})

test.serial.cb('/api/agent/:uuid - not found', t => {
  request(server)
  .get(`/api/agent/${wronguuid}`)
  .set('Authorization', `Bearer ${token}`)
  .expect(200)
  .expect('Content-Type', /json/)
  .end((err, res) => {
    t.truthy(err, 'should return error')
    t.end()
  })
})

test.serial.todo('/api/metrics/:uuid')
test.serial.todo('/api/metrics/:uuid - not found')

test.serial.todo('/api/metrics/:uuid/:type')
test.serial.todo('/api/metrics/:uuid/:type --not found')

test.serial.cb('/api/agents', t => {
  request(server)
        .get('/api/agents')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          t.falsy(err, 'should not return an error')
          let body = JSON.stringify(res.body)
          let expected = JSON.stringify(agentFixtures.connected)
          t.deepEqual(body, expected, 'response body should be the expected')
          t.end()
        })
})
