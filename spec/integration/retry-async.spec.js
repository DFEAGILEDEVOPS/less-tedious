'use strict'
/* global describe beforeAll it expect fail xit spyOn */

const retry = require('../../retry-async')
const sqlConfig = require('../../example-config')
const sql = require('mssql')

const retryConfiguration = {
  attempts: 3,
  pauseTimeMs: 100,
  pauseMultiplier: 1.5
}

describe('retry:integration', () => {
  beforeAll(async () => {
    const config = {
      user: sqlConfig.Application.Username,
      password: sqlConfig.Application.Password,
      server: sqlConfig.Server,
      database: sqlConfig.Database,
      connectionTimeout: sqlConfig.connectionTimeout || 30000,
      requestTimeout: sqlConfig.requestTimeout || 15000,
      pool: {
        max: sqlConfig.Pooling.MaxCount || 5,
        min: sqlConfig.Pooling.MinCount || 0,
        idleTimeoutMillis: sqlConfig.Pooling.IdleTimeout || 30000
      },
      options: {
        encrypt: sqlConfig.Encrypt
      }
    }
    await sql.connect(config)
  })

  it('should be transparent when handled method works correctly', async () => {
    const handledFn = async () => {
      return sql.query('SELECT * FROM Settings')
    }
    let settingsRows = await retry(handledFn, retryConfiguration)
    expect(settingsRows).toBeDefined()
    expect(settingsRows.recordset.length).toBe(1)
    const record = settingsRows.recordset[0]
    expect(record.loadingTimeLimit).toBe(3)
  })

  it('should retry 3 times when handled method fails', async () => {
    const handledFn = async () => {
      return sql.query('SELECT * FROM TableThatDoesNotExist')
    }
    const spy = jasmine.createSpy().and.callFake(handledFn)
    try {
      await retry(spy, retryConfiguration)
      fail('error should have been thrown')
    } catch (error) {
      expect(error.message).toContain(`Invalid object name 'TableThatDoesNotExist'`)
    }
    expect(spy).toHaveBeenCalledTimes(3)
  })

  it('it does not retry if predicate condition is not met', async () => {
    const handledFn = async () => {
      return sql.query('SELECT * FROM TableThatDoesNotExist')
    }
    const predicate = (error) => {
      // will always fail
      return error.message === 'sql server is busy'
    }
    const spy = jasmine.createSpy().and.callFake(handledFn)
    try {
      await retry(spy, retryConfiguration, predicate)
      fail('error should have been thrown')
    } catch (error) {
      expect(error.message).toContain(`Invalid object name 'TableThatDoesNotExist'`)
    }
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('it retries specified number of times when predicate met', async () => {
    const handledFn = async () => {
      return sql.query('SELECT * FROM TableThatDoesNotExist')
    }
    const predicate = () => {
      return true
    }
    const spyObject = {
      myFunc: handledFn
    }
    spyOn(spyObject, 'myFunc').and.callThrough()
    try {
      await retry(spyObject.myFunc, retryConfiguration, predicate)
      fail('error should have been thrown')
    } catch (error) {
      expect(error.message).toContain(`Invalid object name 'TableThatDoesNotExist'`)
      expect(spyObject.myFunc).toHaveBeenCalledTimes(3)
      return
    }
    fail('error should have been caught')
  })
})
