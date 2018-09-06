'use strict'

const ConnectionPool = require('tedious-connection-pool')
const winston = require('winston')

const sqlPoolService = {}
let mainPool = null
let config

/**
 * Initialise the connection pool.  Called once per application instance
 */
sqlPoolService.init = (sqlConfig) => {
  config = sqlConfig
  // full config details: https://github.com/tediousjs/tedious/blob/master/src/connection.js

  const mainConnectionConfig = {
    appName: config.Sql.Application.Name,
    userName: config.Sql.Application.Username,
    password: config.Sql.Application.Password,
    server: config.Sql.Server,
    options: {
      port: config.Sql.Port,
      database: config.Sql.Database,
      encrypt: true,
      requestTimeout: config.Sql.Timeout
    }
  }

  const mainPoolConfig = {
    min: config.Sql.Pooling.MinCount,
    max: config.Sql.Pooling.MaxCount
  }

  if (mainPool == null) {
    mainPool = new ConnectionPool(mainPoolConfig, mainConnectionConfig)
    mainPool.on('error', function (err) {
      winston.error(err)
    })
  }
}

/**
 * Get a connection from the pool.
 * @return {Promise}
 */
sqlPoolService.getConnection = () => {
  return new Promise((resolve, reject) => {
    if (mainPool === null) {
      sqlPoolService.init(config)
    }
    mainPool.acquire(function (err, connection) {
      if (err) {
        reject(err)
        return
      }
      resolve(connection)
    })
  })
}

/**
 * Disconnect all pool connections
 */
sqlPoolService.drain = () => {
  if (mainPool) {
    mainPool.drain()
  }
}

module.exports = sqlPoolService
