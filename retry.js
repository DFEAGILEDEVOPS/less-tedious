'use strict'

const defaultDelayMs = process.env.RETRY_DEFAULT_WAIT_TIME || 100

const pause = (duration) => new Promise(res => setTimeout(res, duration))
const defaultCondition = () => true

const asyncRetryHandler = async (retries, fn, condition = defaultCondition) => {
  try {
    const result = await fn()
    return result
  } catch (error) {
    console.log('error:' + error)
    if (retries > 1 && condition(error)) {
      console.log(`waiting ${defaultDelayMs}ms before trying again...`)
      await pause(defaultDelayMs)
      await asyncRetryHandler(retries - 1, fn, condition)
    } else {
      console.error('retries exhausted, throwing error.')
      throw error
    }
  }
}

module.exports = asyncRetryHandler
