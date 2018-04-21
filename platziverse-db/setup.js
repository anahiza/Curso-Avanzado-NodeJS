'use strict'

const db = require('./')
const inquirer = require('inquirer')
const chalk = require('chalk')
const debug = require('debug')('platziverse:db:setup')

const minimist = require('minimist')
const args = minimist(process.argv)
const prompt = inquirer.createPromptModule()
async function setup () {
  if (!args.yes) {
    const answer = await inquirer.prompt(
      [
        {
          type: 'confirm',
          name: 'setup',
          message: 'This will destroy your database, are you sure?'
        }
      ]
  )
    if (!answer.setup) {
      return console.log('Nothing happened!')
    }
  }

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
  console.log(chalk.green('Success!'))
  process.exit(0)
}
function handleFatalError (err) {
  console.error(`${chalk.red('[fatal error]')} ${err.message}`)
  console.error(err.stack)
  process.exit(1)
}

setup()
