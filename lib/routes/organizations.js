const { Router } = require('express'); 
const Organization = rquier('../models/Organization.js');

module.exports = Router()

// the create route will be used when a new organization is created
// the get all route will be used to see all organizations (_id, title, and imageUrl of organization only)
// the get by id route will be used to get details about an organization
// the update route will be used to update organization information
// the delete route will be used if an organization is disbanded 
