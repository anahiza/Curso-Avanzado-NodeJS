'use strict'
const test = require('ava')
const sinon = require('sinon')
const proxyquire = require('proxyquire')
const agentFixtures = require('./fixtures/agent')
const metricFixtures = require('./fixtures/metric')

let db = null
let config = {
  logging () {}
}

let sandbox = null
let MetricStub = null
let AgentStub = null
let uuid = 'yyy-yyy-yyy'
let type = 'CPU'
let uuidArgs = {
  where: { uuid }
}
let metricUuidArgs = {
  attributes: [ 'type' ],
  group: ['type'],
  include: [{
    attributes: [],
    model: AgentStub,
    where: {
      uuid
    }
  }],
  raw: true
}

let typeUuidArgs = {
  attributes: ['id', 'type', 'value', 'createdAt'],
  where: {
    type
  },
  limit: 20,
  order: [['createdAt', 'DESC']],
  include: [{
    attributes: [],
    model: AgentStub,
    where: {
      uuid
    }
  }],
  raw: true
}

test.beforeEach(async() => {
  sandbox = sinon.sandbox.create()
  MetricStub = {
    belongsTo: sinon.spy()
  }
  AgentStub = {
    hasMany: sandbox.spy()
  }

    // Model create stub
  AgentStub.findOne = sandbox.stub()
  AgentStub.findOne.withArgs(uuidArgs).returns(Promise.resolve(agentFixtures.byUuid))

  MetricStub.create = sandbox.stub()
  MetricStub.create.withArgs(metricFixtures.new).returns(Promise.resolve({
    toJSON () { return metricFixtures.new }
  }))

  metricUuidArgs.include[0].model = AgentStub
  typeUuidArgs.include[0].model = AgentStub

  //Model findAll Stub
  MetricStub.findAll = sandbox.stub()
  MetricStub.findAll.withArgs().returns(Promise.resolve(metricFixtures.all))
  MetricStub.findAll.withArgs(metricUuidArgs).returns(Promise.resolve(metricFixtures.findByAgentUuid(uuid)))
  MetricStub.findAll.withArgs(typeUuidArgs).returns(Promise.resolve(metricFixtures.findByTypeAgentUuid(type, uuid)))
  
  const setupDatabase = proxyquire('../', {
    './models/agent': () => AgentStub,
    './models/metric': () => MetricStub
  })
  db = await setupDatabase(config)
  console.log(db.Metric)
})

test.afterEach(() => {
  sandbox && sinon.sandbox.restore()
})

test.serial('create', t => {
  t.truthy(db.Metric, 'Metric service should exist')
})

test.serial('Setup Metric', t => {
    t.true(AgentStub.hasMany.called, 'AgentModel.hasMany was executed')
    t.true(AgentStub.hasMany.calledWith(MetricStub), 'Argument should be the MetricStub')
    t.true(MetricStub.belongsTo.called, 'MetricModel.belongsTo was executed')
    t.true(MetricStub.belongsTo.calledWith(AgentStub), 'Argument should be the AgentModel')
})

test.serial('Metric#findByAgentUuid', async t => {
    let metric = await db.Metric.findByAgentUuid(uuid)
    t.true(MetricStub.findAll.called, 'findAll should be called on model')
    t.true(MetricStub.findAll.calledOnce, 'findAll should be called once')
    t.true(MetricStub.findAll.calledWith(metricUuidArgs), 'findAll should be called with metric args')
    t.deepEqual(metric, metricFixtures.findByAgentUuid(uuid), 'should be the same')
})
