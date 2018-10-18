var router = require('express').Router()

var {userExists, createUser} = require('../db/users')
var token = require('../auth/token')

router.post('/register', register, token.issue)

function register (req, res, next) {
  const {user_name, display_name, img, password} = req.body
  userExists(user_name)
    .then(exists => {
      if (exists) return res.status(400).send({message: "User exists"})
      createUser(user_name, display_name, img, password)
        .then(() => next())
    })
    .catch(err => res.status(500).send({message: err.message}))
}

router.post('/login', login, token.issue)

function login (req, res, next) {
  const { user_name } = req.body
  console.log(req.body)
  userExists(user_name)
    .then(exists => {
      if (exists) next()
      else res.status(400).send({ message: 'User does not exist' })
    })
    .catch(err => res.status(500).send({ message: err.message }))
}

module.exports = router
