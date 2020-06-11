const mongoose = require('mongoose'); 

// The Vote model should include a reference to a poll, a reference to a user, a reference to the option selected.

const schema = new mongoose.Schema({

  poll: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Poll', 
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true
  }, 
  options: { 
    type: String, 
    required: true
  }

});

module.exports = mongoose.model('Vote', schema);
