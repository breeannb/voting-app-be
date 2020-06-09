const { Router } = require('express'); 
const Organization = require('../models/Organization.js');

module.exports = Router()
// the create route will be used when a new organization is created
  .post('/', (req, res, next) => {
    Organization
      .create(req.body)
      .then(organization => res.send(organization))
      .catch(next); 
  })

// the get all route will be used to see all organizations (_id, title, and imageUrl of organization only)

  .get('/', (req, res, next) => {
    Organization
      .find()
      .select({
        title: true, 
        imageUrl: true
      })
      .then(organizations => res.send(organizations))
      .catch(next);
  })

// the get by id route will be used to get details about an organization
  .get('/:id', (req, res, next) => {
    Organization 
      .findById(req.params.id)
      .then(organization => res.send(organization))
      .catch(next); 
  })

// the update route will be used to update organization information
  .patch('/:id', (req, res, next) => {
    Organization
      .findByIdAndUpdate(req.params.id, req.body, { new: true})
      .then(organization => res.send(organization))
      .catch(next); 
  });



// the delete route will be used if an organization is disbanded 
