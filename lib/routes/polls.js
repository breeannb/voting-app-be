const { Router } = require('express'); 
const Poll = require('../models/Poll'); 
const Vote = require('../models/Vote'); 

module.exports = Router()

  .post('/', (req, res, next) => {
    Poll
      .create(req.body)
      .then(poll => res.send(poll))
      .catch(next); 
  })

  .get('/', (req, res, next) => {
    Poll
      .find(req.query)
      .select({
        title: true
      })
      .then(polls => res.send(polls))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Poll
      .findById(req.params.id)
      .populate('organization', { title: true, description: true, imageUrl: true })
      .then(poll => res.send(poll))
      .catch(next);
  })

  .patch('/:id', (req, res, next) => {
    Poll
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(poll => res.send(poll))
      .catch(next);
  })

// .delete('/:id', (req, res, next) => {
//   Poll
//     .findByIdAndDelete(req.params.id)
//     .then(poll => res.send(poll))
//     .catch(next);
// });

  .delete('/:id', async(req, res, next) => {

    const poll = await Poll
      .findByIdAndDelete(req.params.id); 

    const votes = await Vote
      .deleteMany({ poll: req.params.id });

    Promise.all([
      Poll 
        .findByIdAndDelete(req.params.id), 
      Vote
        .deleteMany({ parlor: req.params.id })
    ])
      .then(([poll, votes]) => res.send(poll))
      .catch(next);
  });

  
