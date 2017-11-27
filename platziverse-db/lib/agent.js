'use strict'

module.exports = function setupAgent (AgentModel) {
  function findById (id) {
    return AgentModel.findById(id)
  }

   function createOrUpdate(agent){
    const cond = {
      where: {
        uuid: agent.uuid
      }      
    }
    const existingAgent = await AgentModel.findOne(cond)
    if (existingAgent){
      const updated = await AgentModel.update(agent, cond)
      return updated ? Agent.findOne(cond) : existingAgent
    }

    const result = await AgentModel.create(agent)
    return result.toJSON()
  }

  return {
    findById,
    createOrUpdate
  }
}
