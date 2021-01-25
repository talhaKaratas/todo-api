const router = require('express').Router()
const User = require('../models/User')
const bicrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const verify = require('./verifyToken')
const {
  registerValidation,
  loginValidation,
  userInfoValidation,
  passwordValidation
} = require('../validation')

router.post('/register', async (req, res) => {
  //Validation
  const { error } = registerValidation(req.body)
  if (error) return res.status(401).send({ message: error.details[0].message })

  // Email already exist
  const emailExist = await User.findOne({ email: req.body.email })
  if (emailExist)
    return res.status(401).send({ message: 'Email already exist' })

  //Hashing password
  const hash = await bicrypt.genSalt(10)
  const hashPassword = await bicrypt.hash(req.body.password, hash)

  //Save user
  const user = new User({
    name: req.body.name,
    surname: req.body.surname,
    email: req.body.email,
    password: hashPassword
  })

  try {
    const savedUser = await user.save()
    res.send({ _id: savedUser._id })
  } catch (err) {
    res.status(401).send({ message: err })
  }
})

router.post('/login', async (req, res) => {
  //Validation
  const { error } = loginValidation(req.body)
  if (error) return res.status(401).send({ message: error.details[0].message })

  //checking user already in DB
  const user = await User.findOne({ email: req.body.email })
  if (!user)
    return res.status(401).send({ message: 'Email or password is wrong' })

  //Compare password
  const validPass = await bicrypt.compare(req.body.password, user.password)
  if (!validPass)
    return res.status(401).send({ message: 'Email or password is wrong' })

  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET)
  res.header('auth_token', token).send({ token })
})

router.delete('/delete', verify, async (req, res) => {
  const userId = req.user._id
  try {
    const deletedUser = await User.deleteOne({ _id: userId })
    res.send(deletedUser)
  } catch (err) {
    res.status(401).send({ message: err.message })
  }
})

// Get User Name and Surname
router.get('/info', verify, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id })
    res.send({ name: user.name, surname: user.surname })
  } catch (err) {
    res.status(500).send({ message: err.message })
  }
})

//Change registered User Name or Surname
router.patch('/change-name-or-surname', verify, async (req, res) => {
  //Validation
  const { error } = userInfoValidation(req.body)
  if (error) return res.status(401).send({ message: error.details[0].message })

  try {
    const updatedUser = await User.updateOne(
      { _id: req.user._id },
      {
        $set: {
          name: req.body.name,
          surname: req.body.surname
        }
      }
    )
    res.send(updatedUser)
  } catch (err) {
    res.status(500).send({ message: err.message })
  }
})

//Change registered user password
router.patch('/change-password', verify, async (req, res) => {
  //Validation
  const { error } = passwordValidation({ password: req.body.newPassword })
  if (error) return res.status(401).send({ message: error.details[0].message })

  const user = await User.findOne({ _id: req.user._id })
  if (!user) res.status(500).send({ message: 'Unknown error' })

  //compare password
  const validPass = await bicrypt.compare(req.body.oldPassword, user.password)
  if (!validPass) return res.status(400).send({ message: 'Password is wrong' })

  //Hash new password
  const hash = await bicrypt.genSalt(10)
  const newHashPassword = await bicrypt.hash(req.body.newPassword, hash)

  try {
    const updatePassword = await User.updateOne(
      { _id: req.user._id },
      {
        $set: {
          password: newHashPassword
        }
      }
    )
    res.send(updatePassword)
  } catch (err) {
    res.status(500).send({ message: err.message })
  }
})

module.exports = router
