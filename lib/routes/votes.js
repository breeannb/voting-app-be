const { Router } = require('express'); 
const Vote = require('../models/Vote.js');

module.exports = Router()

// the create route will be used to create a new vote
  .post('/', (req, res, next) => {
    Vote
      .create(req.body)
      .then(vote => res.send(vote))
      .catch(next);
  }); 
// the update route will be used to change the voted option 

