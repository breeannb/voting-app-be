const mongoose = require('mongoose'); 

const schema = new mongoose.Schema({

  // model should include a reference to an organization, title, description and a list of options.

  organization: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Organization', 
    required: true
  },
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
  options: {
    type: String, 
    required: true, 
    maxlength: 300, 
    enums: ['Yes', 'No', 'Write In'] //vote yes, no or write in 
  }

});

module.exports = mongoose.model('Poll', schema);
