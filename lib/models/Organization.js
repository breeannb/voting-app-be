const mongoose = require('mongoose'); 

const schema = new mongoose.Schema({
  title: {
    type: String, 
    required: true, 
    maxlength: 50
  }, 
  description: { 
    type: String, 
    required: true, 
    maxlength: 300
  }, 
  imageUrl: {
    type: String, 
    required: true, 
    maxlength: 300
  }

}); 

module.exports = mongoose.model('Organization', schema);
