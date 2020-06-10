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

schema.virtual('polls', {
  ref: 'Poll', 
  localField: '_id', 
  foreignField: 'organization'
});

module.exports = mongoose.model('Organization', schema);
