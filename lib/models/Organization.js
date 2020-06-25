const mongoose = require('mongoose'); 

const organizationSchema = new mongoose.Schema({
  title: {
    type: String
  }, 
  description: { 
    type: String
  }, 
  imageUrl: {
    type: String
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

organizationSchema.virtual('polls', {
  ref: 'Poll', 
  localField: '_id', 
  foreignField: 'organization'
});

organizationSchema.virtual('memberships', {
  ref: 'Membership', 
  localField: '_id', 
  foreignField: 'organization'
});

organizationSchema.statics.deleteAndAllPolls = async function(id) {
  const Poll = this.model('Poll');
  const polls = await Poll.find({ organization: id });
  const deletePollPromises = polls.map(poll => Poll.deleteAndAllVotes(poll._id));

  return Promise.all([
    this.findByIdAndDelete(id),
    ...deletePollPromises
  ])
    .then(([organization]) => organization);
};

module.exports = mongoose.model('Organization', organizationSchema);
