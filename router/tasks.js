const router = require('express').Router()
const User = require('../models/User')
const verify = require('./verifyToken')

router.patch('/write', verify, async (req, res) => {
  try {
    const updateTasks = await User.findOneAndUpdate(
      { _id: req.user._id },
      { $push: { tasks: [{ task: req.body.task }] } },
      { new: true }
    )
    const dates = updateTasks.tasks.map((x) => {
      return new Date(x.date)
    })
    const latest = new Date(Math.max.apply(null, dates))
    const index = updateTasks.tasks.findIndex((x) => x.date === latest)
    const task = updateTasks.tasks.splice(index, 1)
    res.send(...task)
  } catch (err) {
    res.status(500).send({ message: err })
  }
})

router.post('/delete', verify, async (req, res) => {
  try {
    const deletedTask = await User.updateOne(
      { _id: req.user._id },
      {
        $pull: { tasks: { _id: req.body.taskId } }
      }
    )
    res.send(deletedTask)
  } catch (err) {
    res.status(500).send({ message: err.message })
  }
})

router.get('/get-tasks', verify, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id })
    res.send(user.tasks.reverse())
  } catch (err) {
    res.status(500).send({ message: err.message })
  }
})

router.patch('/completed', verify, async (req, res) => {
  try {
    const completeTask = await User.updateOne(
      { _id: req.user._id, 'tasks._id': req.body.taskId },
      { $set: { 'tasks.$.completed': req.body.isComplete } }
    )
    res.send(completeTask)
  } catch (err) {
    res.status(500).send({ message: err.message })
  }
})

module.exports = router
