const router = require('express').Router()
const User = require('../models/User')
const bicrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const verify = require('./verifyToken')
const { registerValidation, loginValidation } = require('../validation')

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

router.get('/info', verify, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id })
    res.send({ name: user.name, surname: user.surname })
  } catch (err) {
    res.status(500).send({ message: err.message })
  }
})

module.exports = router
