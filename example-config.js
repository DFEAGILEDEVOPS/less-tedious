'use strict'

require('dotenv').config()
const oneMinuteInMilliseconds = 60000

module.exports = {
  Database: process.env.SQL_DATABASE || 'mtc',
  Server: process.env.SQL_SERVER || 'localhost',
  Port: process.env.SQL_PORT || 1433,
  ConnectionTimeout: process.env.SQL_TIMEOUT || oneMinuteInMilliseconds,
  Encrypt: true,
  Application: {
    Name: process.env.SQL_APP_NAME || 'less-tedious-integration-tests',
    Username: process.env.SQL_APP_USER || 'mtcAdminUser',
    Password: process.env.SQL_APP_USER_PASSWORD || 'your-chosen*P4ssw0rd_for_dev_env!'
  },
  Pooling: {
    MinCount: process.env.SQL_POOL_MIN_COUNT || 0,
    MaxCount: process.env.SQL_POOL_MAX_COUNT || 5
  }
}
