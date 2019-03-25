'use strict'

require('dotenv').config()
const express = require('express')
const sqlService = require('./index')
const sqlConfig = require('./example-config')

sqlService.initPool(sqlConfig)

const app = express()
const port = 3000

const callDatabase = async (res) => {
  const sql = 'SELECT TOP 1 * FROM [mtc_admin].[settings]'
  await sqlService.queryWithRetry(sql)
  res.sendStatus(200)
}

app.get('/', (req, res) => callDatabase(res))
app.listen(port, () => console.log(`express listening on port ${port}`))
