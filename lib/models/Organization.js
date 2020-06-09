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
    maxlength: 300,
    enum: ['description1', 'description2', 'description3', 'description4']
  }, 
  imageUrl: {
    type: String, 
    required: true, 
    maxlength: 300,
    enum: ['image1.com', 'image2.com', 'image3.com', 'image4.com']
  }

}); 

module.exports = mongoose.model('Organization', schema);
