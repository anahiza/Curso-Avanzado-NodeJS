import { Agent } from 'https'

'use strict'

const test = require('ava')
const sinon = require('sinon')
const proxyquire = require('proxyquire')
const agentFixtures = require('./fixtures/agent')

let db = null
let config = {
  logging: function () {}
}
let id = 1
let single = Object.assign({}, agentFixtures.single)

let sandbox = null

let MetricStub = {
  belongsTo: sinon.spy()
}

let AgentStub = null

test.beforeEach(async () => {
  sandbox = sinon.sandbox.create()
  AgentStub = {
    hasMany: sandbox.spy()
  }

  // Model findById Stub
  AgentStub.findById = sandbox.stub()
  AgentStub.findById.withArgs(id).returns(Promise.resolve(agentFixtures.byId(id)))

  const setupDatabase = proxyquire('../', {
    './models/agent': () => AgentStub,
    './models/metric': () => MetricStub
  })
  db = await setupDatabase(config)
})

test.afterEach(() => {
  sandbox && sinon.sandbox.restore()
})

test('Agent', t => {
  t.truthy(db.Agent, 'Agent sevice should exist')
})

test.serial('Setup', t => {
  t.true(AgentStub.hasMany.called, 'AgentModel.hasMany was executed')
  t.true(AgentStub.hasMany.calledWith(MetricStub), 'Argument should be MetricModel')
  t.true(MetricStub.belongsTo.called, 'MetricModel.belongsTo was executed')
  t.true(MetricStub.belongsTo.calledWith(AgentStub), 'Argument should be the AgentModel')
})

test.serial('AgentFindById', async t => {
  let agent = await db.Agent.findById(id)
  t.true(AgentStub.findById.called, 'Find by id should be called on model')
  t.true(AgentStub.findById.calledOnce, 'FindbyId should be called once')
  t.true(AgentStub.findById.calledWith(id), 'findbyId should be called with 1')
  t.deepEqual(agent, agentFixtures.byId(id), 'should be the same')
})
