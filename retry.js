'use strict'

const defaultDelayMs = 1000
const multiplier = 2

const pause = (duration) => new Promise(res => setTimeout(res, duration))

const asyncRetryHandler = async (retries, fn, delay = defaultDelayMs) => {
  try {
    const result = await fn()
    return result
  } catch (error) {
    console.log('error:' + error)
    if (retries > 1) {
      console.log(`waiting ${delay}ms before trying again...`)
      await pause(delay)
      await asyncRetryHandler(retries - 1, fn, delay * multiplier)
    } else {
      console.error('retries exhausted, throwing error.')
      throw error
    }
  }
}

module.exports = asyncRetryHandler
