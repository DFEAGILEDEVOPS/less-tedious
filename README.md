# less-tedious

Helper package for the node.js tedious SQL Server library, and accompanying mssql client library.

This package provides the following...

- easy to use `query` and `modify` methods that simplifies common SQL calls
- automatic connection management and pool initialisation
- verbose debugging info, enabled by `winston`
- retry logic which tolerates timeouts and other custom conditions of your choosing


## Async Retry mechanism

The async retry handler was created to support the retry of database calls under certain conditions.
For example, when all database connections are saturated, you may want to wait 5 seconds before re-attempting.

### Example

```javascript
const retry = require('./retry-async')
// actual call to database wrapped in an async function... 
const callDatabase = async () => {
  const data = await sql.query('SELECT * FROM [SomeTable]')
  return data
}
// we only want to retry timeout errors...
const onlyRetryTimeoutsPredicate = (error) => {
  return error.message.contains('timeout')
}

const retryPolicy = {
  attempts: 3,
  pauseTimeMs: 5000,
  pauseMultiplier: 1.5
}

const attemptCount = 3
try {
  const data = await retry(callDatabase, retryPolicy, onlyRetryTimeoutsPredicate)
  console.log(`we got some data:${data}`)
} catch (error) {
  console.error(`attempted to query database ${retryPolicy.attempts} times, but all calls were unsuccessful`)
}
```
