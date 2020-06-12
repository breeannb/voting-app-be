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
  imageUrl: {
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

schema.virtual('memberships', {
  ref: 'Membership', 
  localField: '_id', 
  foreignField: 'user'
});

schema.virtual('organizations', {
  ref: 'Organization', 
  localField: '_id', 
  foreignField: 'user'
});

module.exports = mongoose.model('User', schema);
