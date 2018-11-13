var hash = require('../auth/hash')
const db = require('./connection')

function createUser (user_name, display_name, img, password) {
  return new Promise ((resolve, reject) => {
    hash.generate(password, (err, hash) => {
      console.log({err, hash});
      if (err) reject(err)
      db.insert([{user_name: user_name.toLowerCase(), display_name: display_name, img: img, hash}], 'id')
        .into('users')
        .then(user_id => resolve(user_id))
    })

  })
}

function userExists (user_name) {
  return db('users')
    .where('user_name', user_name.toLowerCase())
    .first()
    .then(user => !!user)
}

return db.insert([{round_id, user_id}], 'user_id')
  .into('nominations')

function getUserByName (user_name) {
  return db('users')
    .where('user_name', user_name.toLowerCase())
    .first()
}

module.exports = {
  createUser,
  userExists,
  getUserByName
}
