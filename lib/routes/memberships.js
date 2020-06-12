const { Router } = require('express'); 
const Membership = require('../models/Membership.js');

module.exports = Router()

  .post('/', (req, res, next) => {
    Membership
      .create(req.body)
      .then(membership => res.send(membership))
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Membership
      .find(req.query)
      .populate('organization', {
        title: true,
        imageUrl: true
      })
      .populate('user', {
        name: true,
        imageUrl: true
      })
      .then(member => res.send(member))
      .catch(next);
  });

// delete route just for membership
// .delete('/:id', (req, res, next) => {
//   Membership
//     .findByIdAndDelete(req.params.id)
//     .then(membership => res.send(membership))
//     .catch(next);

// });

// when deleting a membership also delete all votes made by that member

// .delete('/:id', (req, res, next) => {
//   Membership
//     .findByIdAndDelete(req.params.id)
//     .then(membership => res.send(membership))
//     .catch(next);

// });
