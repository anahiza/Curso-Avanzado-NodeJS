'use strict'

const db = require('./')
const debug = require('debug')('platziverse:db:setup')

async function setup () {
  const config = {
    database: process.env.DB_NAME || 'platziverse',
    username: process.env.DB_USER || 'anahi',
    password: process.env.DB_PASS || 'anahi',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    setup: true,
    logging: s => debug(s)
  }
  await db(config).catch(handleFatalError)
  console.log('Success!')
  process.exit(0)
}
function handleFatalError (err) {
  console.error(err.message)
  console.error(err.stack)
  process.exit(1)
}

setup()
