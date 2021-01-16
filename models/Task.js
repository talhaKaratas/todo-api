const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
  task: {
    type: String,
    required: false
  },
  completed: {
    type: Boolean,
    default: false
  },
  date: {
    type: Date,
    default: Date.now()
  }
})

module.exports = taskSchema
