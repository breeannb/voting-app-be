const { Router } = require('express'); 
const User = require('../models/User.js');

module.exports = Router()
// the get by id route will be used to get details about a user
  .get('/:id', (req, res, next) => {
    User
      .findById(req.params.id)
      .then(user => res.send(user))
      .catch(next); 
  });

// the update route will be used to update a user


// the delete route will be used if a user chooses to leave the platform
