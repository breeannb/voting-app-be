const mongoose = require('mongoose'); 

const schema = new mongoose.Schema({
  name: {
    type: String, 
    required: true, 
    maxlength: 50
  }, 
  phone: { 
    type: String, 
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
