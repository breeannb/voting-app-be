const mongoose = require('mongoose'); 

const schema = new mongoose.Schema({
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

//delete a membership and all votes by user
schema.statics.deleteAndAllVotes = async function(id) {
  // const Vote = this.model('Vote');
  // const votes = await Vote.findById({ membership: id });
  
  const membership = await this.findById(id);

  // const deleteVotePromises = votes.map(vote => Vote.deleteAndAllMembershipVotes(vote._id));
  
  return Promise.all([
    this.findByIdAndDelete(id),
    this.model('Vote').deleteMany({ user: membership.user })
  ])
    .then(([membership]) => membership);
};

module.exports = mongoose.model('Membership', schema);
