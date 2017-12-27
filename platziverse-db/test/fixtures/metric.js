'use strict'

const agentFixtures = require('./agent')

const metric = {
  id: 1,
  agentId: 1,
  type: 'CPU',
  value: '18%',
  createdAt: new Date(),
  agent: agentFixtures.byId(1)
}

const newMetric = {
  type: 'Hard Drive',
  value: '2%',
  createdAt: new Date(),
  AgentId: 'yyy-yyy-yyy'
}

const metrics = [
  metric,
  extend(metric, { id: 2, value: '25%' }),
  extend(metric, { id: 3, value: '2%' }),
  extend(metric, { id: 4, agentId: 2, type: 'Memory', value: '33%', agent: agentFixtures.byId(2) })
]

function extend (obj, values) {
  const clone = Object.assign({}, obj)
  return Object.assign(clone, values)
}

function findByAgentUuid (uuid) {
  return metrics.filter(m => m.agent ? m.agent.uuid === uuid : false).map(m => {
    const clone = Object.assign({}, m)

    delete clone.agent

    return clone
  })
}

function findByTypeAgentUuid (type, uuid) {
  return metrics.filter(m => m.type === type && (m.agent ? m.agent.uuid === uuid : false)).map(m => {
    const clone = Object.assign({}, m)

    delete clone.agentId
    delete clone.agent

    return clone
  })
}

module.exports = {
  single: metric,
  new: newMetric,
  all: metrics,
  findByAgentUuid,
  findByTypeAgentUuid
}
