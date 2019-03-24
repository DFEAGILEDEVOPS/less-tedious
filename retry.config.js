'use strict'

module.exports = {
  totalAttempts: 3 || process.env.RETRY_ATTEMPTS,
  pauseAfterAttemptMs: 5000 || process.env.RETRY_DEFAULT_WAIT_TIME,
  pauseMultiplier: 1.5 || process.env.RETRY_PAUSE_MULTIPLIER
}
