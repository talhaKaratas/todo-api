const express = require('express')
const mongoose = require('mongoose')
const authRoute = require('./router/auth')
const tasksRoute = require('./router/tasks')
const cors = require('cors')
require('dotenv/config')

const app = express()

//Connect to db
mongoose.connect(
  process.env.DB_CONNECTION,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log('Connect to DB')
  }
)

app.get('/', (req, res) => {
  res.send('Hello World')
})

//Middlewares
app.use(cors())
app.use(express.json())
//Route middlewares
app.use('/api/user', authRoute)
app.use('/api/tasks', tasksRoute)

app.listen(3000, () => {
  console.log('Server up and run')
})
