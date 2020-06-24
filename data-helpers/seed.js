const chance = require('chance').Chance();
const Organization = require('../lib/models/Organization');
const User = require('../lib/models/User');
const Poll = require('../lib/models/Poll');
const Vote = require('../lib/models/Vote');
const Membership = require('../lib/models/Membership');
require('dotenv').config();
require('../lib/utils/connect');
const mongoose = require('mongoose'); 

const seed = async({ organizations = 5, users = 25, polls = 10, memberships = 5,  } =  {}) => {
  const communicationMediums = ['phone', 'email'];
  const options = ['option1', 'option2', 'option3']; 
  const pollOptions = ['Yes', 'No'];

  const createdOrganizations = await Organization.create([...Array(organizations)].map(() => ({
    title: chance.name(),
    description: chance.paragraph({ sentences: 3 }),
    imageURL: chance.animal()
  })));

  const createdUsers = await User.create([...Array(users)].map(() => ({
    name: chance.name(),
    phone: chance.phone(),
    email: chance.animal(), 
    passwordHash: chance.animal(),
    imageURL: chance.animal(), 
    communicationMedium: chance.pickset(communicationMediums, chance.natural({ min: 1, max: 1 })),
  })));

  const createdPolls = await Poll.create([...Array(polls)].map(() => ({
    organization: chance.pickone(createdOrganizations).id, 
    title: chance.string({ length: 5 }),
    description: chance.paragraph({ sentences: 2 }), 
    passwordHash: chance.animal(),
    options: chance.pickset(pollOptions, chance.natural({ min: 1, max: 1 }))
  })));

  await Membership.create([...Array(memberships)].map(() => ({
    organization: chance.pickone(createdOrganizations).id, 
    user: chance.pickone(createdUsers).id
  })));

  await Vote.create([...Array(polls)].map(() => ({
    poll: chance.pickone(createdPolls).id, 
    user: chance.pickone(createdUsers).id,
    options: chance.pickset(options, chance.natural({ min: 1, max: 1 }))
  })));


};

seed()
  .then(() => {
    mongoose.connection.close(); 
  });
module.exports = {
  seed
};
