const mongoose = require('mongoose')
const taskSchema = require('./Task')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    max: 50,
    min: 3
  },
  surname: {
    type: String,
    required: true,
    max: 50,
    min: 3
  },
  email: {
    type: String,
    required: true,
    max: 120,
    min: 3
  },
  password: {
    type: String,
    required: true,
    min: 6,
    max: 1024
  },
  date: {
    type: Date,
    default: Date.now()
  },
  tasks: [taskSchema]
})

module.exports = mongoose.model('User', userSchema)
