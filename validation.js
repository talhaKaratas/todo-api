const joi = require('@hapi/joi')

const registerValidation = (data) => {
  const schema = joi.object({
    name: joi.string().min(3).max(50).required(),
    surname: joi.string().min(3).max(50).required(),
    email: joi.string().email().min(3).max(120).required(),
    password: joi.string().min(6).max(1024).required()
  })

  return schema.validate(data)
}

const loginValidation = (data) => {
  const schema = joi.object({
    email: joi.string().email().min(3).max(120).required(),
    password: joi.string().min(6).max(1024).required()
  })

  return schema.validate(data)
}

const userInfoValidation = (data) => {
  const schema = joi.object({
    name: joi.string().min(3).max(50).required(),
    surname: joi.string().min(3).max(50).required()
  })

  return schema.validate(data)
}

const passwordValidation = (data) => {
  const schema = joi.object({
    password: joi.string().min(6).max(1024).required()
  })

  return schema.validate(data)
}

module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation
module.exports.userInfoValidation = userInfoValidation
module.exports.passwordValidation = passwordValidation
