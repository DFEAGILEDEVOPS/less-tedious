'use strict'

const pause = (duration) => new Promise(res => setTimeout(res, duration), noReject => undefined)
const defaultRetryCondition = () => true
const defaultConfiguration = {
  attempts: 3,
  pauseTimeMs: 5000,
  pauseMultiplier: 1.5
}

/**
 * @param {function} asyncRetryableFunction - the function to execute with retry behaviour
 * @param {object} retryConfiguration - the behaviour of the retry policy.  Default settings are provided
 * @param {function(Error):Boolean} retryCondition - predicate function to determine if the function should be retried.  Defaults to true
 */
const asyncRetryHandler = async (asyncRetryableFunction, retryConfiguration = defaultConfiguration, retryCondition = defaultRetryCondition) => {
  let retryPolicy = {}
  try {
    Object.assign(retryPolicy, retryConfiguration)
    const result = await asyncRetryableFunction()
    return result
  } catch (error) {
    if (retryPolicy.attempts > 1 && retryCondition(error)) {
      await pause(retryPolicy.pauseTimeMs)
      retryPolicy.attempts -= 1
      retryPolicy.pauseTimeMs *= retryConfiguration.pauseMultiplier
      await asyncRetryHandler(asyncRetryableFunction, retryPolicy, retryCondition)
    } else {
      throw error
    }
  }
}

/**
 * @param {number} attempts - the total number of attempts to make at calling the function successfully
 * @param {function} asyncFn - the async function to attempt
 * @param {function(error:Error)} condition - a predicate that allows you to retry only in certain conditions.  Receives the error argument.  For example - this is useful when you only want to retry a database timeout error, but not a syntax error.
 */
const asyncRetryHandlerV1 = async (attempts, asyncFn, condition = defaultRetryCondition) => {
  try {
    const result = await asyncFn()
    return result
  } catch (error) {
    if (attempts > 1 && condition(error)) {
      await pause(defaultConfiguration.pauseTimeMs)
      await asyncRetryHandler(attempts - 1, asyncFn, condition)
    } else {
      throw error
    }
  }
}

module.exports = asyncRetryHandler
