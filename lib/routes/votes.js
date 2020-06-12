const { Router } = require('express'); 
const Vote = require('../models/Vote.js');

module.exports = Router()

  .post('/', (req, res, next) => {
    Vote
      .findOneAndUpdate({ poll: req.body.poll, user: req.body.user }, req.body, { new: true, upsert: true })
      //upsert means if has it, update if not, create it 
      .then(vote => res.send(vote))
      .catch(next);
  })

  .patch('/:id', (req, res, next) => {
    Vote
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(vote => res.send(vote))
      .catch(next);
  });
