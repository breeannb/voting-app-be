const chance = require('chance').Chance();
const Organization = require('../lib/models/Organization');
const User = require('../lib/models/User');
const Poll = require('../lib/models/Poll');
const Vote = require('../lib/models/Vote');
const Membership = require('../lib/models/Membership');

const seed = async({ organizations = 5, users = 25, polls = 10, memberships = 5, votes = 100 } =  {}) => {
  const communicationMediums = ['phone', 'email'];
  const voteOptions = ['option1', 'option2', 'option3']; 
  const pollOptions = ['Yes', 'No'];

  const createdOrganizations = await Organization.create([...Array(organizations)].map(() => ({
    title: chance.name(),
    description: chance.paragraph({ sentences: 3 }),
    imageUrl: chance.animal()
  })));

  const createdUsers = await User.create([...Array(users)].map(() => ({
    name: chance.name(),
    phone: chance.phone(),
    email: chance.email(), 
    passwordHash: chance.animal(),
    imageUrl: chance.animal(), 
    communicationMedium: chance.pickone(communicationMediums)
  })));

  const createdPolls = await Poll.create([...Array(polls)].map(() => ({
    organization: chance.pickone(createdOrganizations).id, 
    title: chance.string({ length: 5 }),
    description: chance.paragraph({ sentences: 2 }), 
    passwordHash: chance.animal(),
    options: chance.pickone(pollOptions, chance.natural({ min: 1, max: 1 }))
  })));

  await Membership.create([...Array(memberships)].map(() => ({
    organization: chance.pickone(createdOrganizations).id, 
    user: chance.pickone(createdUsers).id
  })));

  await Vote.create([...Array(votes)].map(() => ({
    poll: chance.pickone(createdPolls).id, 
    user: chance.pickone(createdUsers).id,
    options: chance.pickone(voteOptions)
  })));
};

module.exports = {
  seed
};
