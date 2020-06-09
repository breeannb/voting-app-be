// the get by id route will be used to get details about a user
// the update route will be used to update a user
// the delete route will be used if a user chooses to leave the platform

const mongoose = require('mongoose'); 

const schema = new mongoose.Schema({
  name: {
    type: String, 
    required: true, 
    maxlength: 50
  }, 
  phone: { 
    type: Number, 
    required: true, 
    maxlength: 15
  }, 
  email: {
    type: String, 
    required: true, 
    maxlength: 300
  },
  communicationMedium: {
    type: String, 
    required: true, 
    enum: ['phone', 'email'],
    maxlength: 300
  }

}); 

module.exports = mongoose.model('User', schema);
