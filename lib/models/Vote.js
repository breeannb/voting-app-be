const mongoose = require('mongoose'); 
const { voteAmount }  = require('../models/votes-aggregations');

const voteSchema = new mongoose.Schema({

  poll: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Poll'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
  }, 
  options: { 
    type: String
  }

});

voteSchema.statics.voteAmount = function(){
  return this.aggregate(voteAmount);
};

module.exports = mongoose.model('Vote', voteSchema);
