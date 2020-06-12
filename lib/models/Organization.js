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
}, {
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.id;
      delete ret.__v;
    }
  },
  toObject: {
    virtuals: true }
}); 

schema.virtual('polls', {
  ref: 'Poll', 
  localField: '_id', 
  foreignField: 'organization'
});

schema.virtual('membership', {
  ref: 'Membership', 
  localField: '_id', 
  foreignField: 'organization'
});

//organization by id tests will fail 

module.exports = mongoose.model('Organization', schema);
