'use strict'

const config = require('./retry.config')
const defaultDelayMs = config.pauseAfterAttemptMs
// TODO implement exponential delay between attempts
// const pauseMultiplier = config.pauseMultiplier
const pause = (duration) => new Promise(res => setTimeout(res, duration))
const defaultCondition = () => true

/**
 * 
 * @param {number} attempts - the total number of attempts to make at calling the function successfully
 * @param {function} asyncFn - the async function to attempt
 * @param {function(error:Error)} condition - a predicate that allows you to retry only in certain conditions.  Receives the error argument.  For example - this is useful when you only want to retry a database timeout error, but not a syntax error.
 */
const asyncRetryHandler = async (attempts, asyncFn, condition = defaultCondition) => {
  try {
    const result = await asyncFn()
    return result
  } catch (error) {
    console.log('error:' + error)
    if (attempts > 1 && condition(error)) {
      console.log(`waiting ${defaultDelayMs}ms before trying again...`)
      await pause(defaultDelayMs)
      await asyncRetryHandler(attempts - 1, asyncFn, condition)
    } else {
      console.error('retries exhausted, throwing error.')
      throw error
    }
  }
}

module.exports = asyncRetryHandler
