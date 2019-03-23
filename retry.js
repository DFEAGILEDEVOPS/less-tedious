'use strict'

const defaultDelayMs = 1000
const multiplier = 2

const pause = (duration) => new Promise(res => setTimeout(res, duration))

const asyncRetryHandler = async (retries, fn, delay = defaultDelayMs) => {
  console.log(`attepting async try ${retries}`)
  try {
    await fn()
  } catch (error) {
    console.log('error:' + error)
    if (retries > 1) {
      console.log(`waiting ${delay}ms...`)
      await pause(delay)
      await asyncRetryHandler(retries - 1, fn, delay * multiplier)
    } else {
      throw error
    }
  }
}

module.exports = asyncRetryHandler
