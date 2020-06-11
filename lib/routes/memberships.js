const { Router } = require('express'); 
const Membership = require('../models/Membership.js');

module.exports = Router()

// the create route will be used to create a new membership
  .post('/', (req, res, next) => {
    Membership
      .create(req.body)
      .then(membership => res.send(membership))
      .catch(next);
  })

// (/api/v1/memberships?org=ORG_ID) the get all route will be used to see all users in an organization (_id, name, and imageUrl only)
// if no organization id is provided send an error

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

// the delete route will be used to remove a membership


