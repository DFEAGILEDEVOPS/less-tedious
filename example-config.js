'use strict'
const oneMinuteInMilliseconds = 60000

module.exports = {
  Sql: {
    Database: process.env.SQL_DATABASE || 'database',
    Server: process.env.SQL_SERVER || 'localhost',
    Port: process.env.SQL_PORT || 1433,
    Timeout: process.env.SQL_TIMEOUT || oneMinuteInMilliseconds,
    Encrypt: true,
    Application: {
      Name: process.env.SQL_APP_NAME || 'example-app-name',
      Username: process.env.SQL_APP_USER || 'example-app-user',
      Password: process.env.SQL_APP_USER_PASSWORD || 'example-sql-password'
    },
    Pooling: {
      MinCount: process.env.SQL_POOL_MIN_COUNT || 5,
      MaxCount: process.env.SQL_POOL_MAX_COUNT || 10,
      LoggingEnabled: true // ToDO: not used yet
    }
  }
}
