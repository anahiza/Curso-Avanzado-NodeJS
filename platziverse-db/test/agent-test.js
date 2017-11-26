'use strict'

const test = require('ava')
let db = null
let config = {
  logging: function () {}
}

test.beforeEach(async () => {
  const setupDatabase = require('../')
  db = await setupDatabase(config)
})

test('Agent', t => {
  t.truthy(db.Agent, 'Agent sevice should exist')
})
