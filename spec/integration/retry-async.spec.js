'use strict'
/* global describe beforeAll it expect fail xit spyOn */

const retry = require('../../retry-async')
const sqlConfig = require('../../example-config')
const sql = require('../../index')

describe('retry:integration', () => {
  beforeAll(async () => {
    await sql.initPool(sqlConfig)
    await sql.updateDataTypeCache()
  })

  it('should be transparent when handled method works correctly', async () => {
    const handledFn = async () => {
      const data = await sql.query('SELECT * FROM Settings')
      return data
    }
    let settingsRows = await retry(3, handledFn)
    expect(settingsRows).toBeDefined()
    expect(settingsRows.length).toBe(1)
    expect(settingsRows[0].loadingTimeLimit).toBe(3)
  })

  it('should retry 3 times when handled method fails', async () => {
    const handledFn = async () => {
      const data = await sql.query('SELECT * FROM TableThatDoesNotExist')
      return data
    }
    const spy = jasmine.createSpy().and.callFake(handledFn)
    try {
      await retry(3, spy)
      fail('error should have been thrown')
    } catch (error) {
      expect(error.message).toContain(`Invalid object name 'TableThatDoesNotExist'`)
    }
    expect(spy).toHaveBeenCalledTimes(3)
  })

  it('it does not retry if predicate condition is not met', async () => {
    const handledFn = async () => {
      const data = await sql.query('SELECT * FROM TableThatDoesNotExist')
      return data
    }
    const predicate = (error) => {
      console.log(`error in predicate is:${error}`)
      // will always fail
      return error.message === 'sql server is busy'
    }
    const spy = jasmine.createSpy().and.callFake(handledFn)
    try {
      await retry(3, spy, predicate)
      fail('error should have been thrown')
    } catch (error) {
      expect(error.message).toContain(`Invalid object name 'TableThatDoesNotExist'`)
    }
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('it retries specified number of times when predicate met', async () => {
    const handledFn = async () => {
      const data = await sql.query('SELECT * FROM TableThatDoesNotExist')
      return data
    }
    const predicate = (error) => {
      return error.message.startsWith(`Invalid object name 'TableThatDoesNotExist'`)
    }
    const spy = jasmine.createSpy().and.callFake(handledFn)
    try {
      await retry(3, spy, predicate)
      fail('error should have been thrown')
    } catch (error) {
      expect(error.message).toContain(`Invalid object name 'TableThatDoesNotExist'`)
    }
    expect(spy).toHaveBeenCalledTimes(3)
  })
})
