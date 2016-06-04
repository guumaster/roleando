'use strict'

const shortid = require('shortid')

const insertOne = require('../../../../storage/insert_one')
const findOneAndUpdate = require('../../../../storage/find_one_and_update')
const validateTable = require('./validate')

const processUpdate = raw => {
  const update = {}
  if (raw.data.tables ) {
    update['data.tables'] = raw.data.tables
  }
  if (raw.data.tpls) {
    update['data.tpls'] = raw.data.tpls
  }
  if (raw.data.remotes) {
    update['data.remotes'] = raw.data.remotes
  }
  return update
}
module.exports = (inId, newData) => validateTable(newData).then(() => {
  if (inId) {
    return findOneAndUpdate('generator_tables', { tableId: inId }, { $set: processUpdate(newData) }).then(op => {
      if (!op.ok) {
        return Promise.reject(new Error('Can\'t save data'))
      }
      delete op.value._id
      return op.value
    })
  }

  newData.tableId = shortid.generate()
  return insertOne('generator_tables', newData)
    .then(op => {
      if (!op.result.ok) {
        return Promise.reject(new Error('Can\'t save data'))
      }
      delete newData._id
      return newData
    })
})