'use strict'

module.exports = function sestupAgent (AgentModel) {
  function findById (id) {
    return AgentModel.findById(id)
  }

  return {
    findById
  }
}
