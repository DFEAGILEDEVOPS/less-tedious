'use strict'

const defaultDelayMs = process.env.RETRY_DEFAULT_WAIT_TIME || 100

const pause = (duration) => new Promise(res => setTimeout(res, duration))
const defaultCondition = () => true

const asyncRetryHandler = async (retries, asyncFn, condition = defaultCondition) => {
  try {
    const result = await asyncFn()
    return result
  } catch (error) {
    console.log('error:' + error)
    if (retries > 1 && condition(error)) {
      console.log(`waiting ${defaultDelayMs}ms before trying again...`)
      await pause(defaultDelayMs)
      await asyncRetryHandler(retries - 1, asyncFn, condition)
    } else {
      console.error('retries exhausted, throwing error.')
      throw error
    }
  }
}

module.exports = asyncRetryHandler
