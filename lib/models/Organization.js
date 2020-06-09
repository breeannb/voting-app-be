const mongoose = require('mongoose'); 

const schema = new mongoose.Schema({
  title: {
    type: String, 
    required: true, 
    maxlength: 50, 
    enum: ['Environmental Voter Project 1', 'League of Women Voters 2', 'Them.us 3']
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
