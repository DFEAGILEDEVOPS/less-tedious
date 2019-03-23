'use strict'

module.exports = {
  database: process.env.SQL_DATABASE || 'mtc',
  server: process.env.SQL_SERVER || 'localhost',
  port: process.env.SQL_PORT || 1433,
  user: process.env.SQL_APP_USER || 'mtcAdminUser', // docker default
  password: process.env.SQL_APP_USER_PASSWORD || 'your-chosen*P4ssw0rd_for_dev_env!', // docker default
  pool: {
    min: process.env.SQL_POOL_MIN_COUNT || 0,
    max: process.env.SQL_POOL_MAX_COUNT || 5
  },
  options: {
    appName: process.env.SQL_APP_NAME || 'less-tedious-integration-tests', // docker default
    encrypt: process.env.SQL_ENCRYPT || true
  }
}
