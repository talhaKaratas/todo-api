const router = require('express').Router()
const User = require('../models/User')
const verify = require('./verifyToken')

router.patch('/write', verify, async (req, res) => {
  try {
    const updateTasks = await User.updateOne(
      { _id: req.user._id },
      { $push: { tasks: [{ task: req.body.task }] } }
    )
    res.send(updateTasks)
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

module.exports = router
