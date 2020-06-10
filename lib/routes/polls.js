const { Router } = require('express'); 
const Poll = require('../models/Poll'); 

module.exports = Router()

// the create route will be used to create a new poll
  .post('/', (req, res, next) => {
    Poll
      .create(req.body)
      .then(poll => res.send(poll))
      .catch(next); 
  })

// the get all route will be used to see all polls for an organization (_id and title only)
  .get('/', (req, res, next) => {
    Poll
      .find(req.query)
      .select({
        title: true
      })
      .then(polls => res.send(polls))
      .catch(next);
  })

// the get by id route will be used to get details about a poll (populate organization information)
  .get('/:id', (req, res, next) => {
    Poll
      .findById(req.params.id)
      .populate('organization', { title: true, description: true, imageUrl: true })
      .then(poll => res.send(poll))
      .catch(next);
  });

// the update route will be used to update a polls title and/or description

// the delete route will be used to remove a poll
