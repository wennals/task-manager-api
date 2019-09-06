/** 
 * Creates the express application 
 * and gets it up and running 
 * */ 
const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()

// Automatically parses incoming JSON into objects
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

module.exports = app


