const { MongoMemoryServer } = require('mongodb-memory-server'); 
const mongod = new MongoMemoryServer(); 
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect.js'); 

const request = require('supertest'); 
const app = require('../lib/app'); 
const Vote = require('../lib/models/Vote.js');
const User = require('../lib/models/User');
const Poll = require('../lib/models/Poll'); 
const Organization = require('../lib/models/Organization'); 

beforeAll(async() => {
  const uri = await mongod.getUri();
  return connect(uri);
});
  
beforeEach(() => {
  return mongoose.connection.dropDatabase();
});

//create an organization
let organization;
beforeEach(async() => {
  organization = await Organization.create({
    title: 'League of Women Voters Organization',
    description: 'League of Women Group for Voting Info',
    imageUrl: 'image2.com'
  });
});

//create one poll
let poll;
beforeEach(async() => {
  poll = await Poll.create({
    organization: organization.id,
    title: 'A Poll to Save Older Forests, the Owl\'s Habitat',
    description: 'A vote for the Owls, please give a Hoot', 
    options: 'Yes'
  });
});
  
//create one user
let userOne;
beforeEach(async() => {
  userOne = await User.create({
    name: 'Sally', 
    phone: '(570)404-5231', 
    email: 'sally@sally.com', 
    imageUrl: 'image11.com',
    communicationMedium: 'email'
  });
});

// //create second user
// let userTwo;
// beforeEach(async() => {
//   userTwo = await User.create({
//     name: 'Sam', 
//     phone: '(570)404-5232', 
//     email: 'sam@sam.com', 
//     imageUrl: 'image12.com',
//     communicationMedium: 'email'
//   });
// });
  
afterAll(async() => {
  await mongoose.connection.close();
  return mongod.stop();
});


describe('vote routes', () => {

  // the create route will be used to create a new vote
  it('creates a new vote using POST', () => {

    return request(app)
      .post('/api/v1/votes')
      .send({
        poll: poll.id,
        user: userOne.id,
        options: 'Yes',
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          poll: poll.id,
          user: userOne.id, 
          options: 'Yes',
          __v: 0
        });
      });

  });

  // the update route will be used to change the voted option 
  it('updates a vote by id via PATCH', () => {
    return Vote.create({
      poll: poll.id,
      user: userOne.id,
      options: 'Yes',
    })
      .then(vote => {
        return request(vote)
          .patch(`/api/v1/votes?user_id=${vote._id}`)
          .send({ options: 'No' });
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          poll: poll.id,
          user: userOne.id, 
          options: 'No',
          __v: 0
        });
      });
  }); 

});
