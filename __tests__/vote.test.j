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

let organization;
beforeEach(async() => {
  organization = await Organization.create({
    title: 'League of Women Voters Organization',
    description: 'League of Women Group for Voting Info',
    imageUrl: 'image2.com'
  });
});

let poll;
beforeEach(async() => {
  poll = await Poll.create({
    organization: organization.id,
    title: 'A Poll to Save Older Forests, the Owl\'s Habitat',
    description: 'A vote for the Owls, please give a Hoot', 
    options: 'Yes'
  });
});
  
let userOne;
beforeEach(async() => {
  userOne = await User.create({
    name: 'Sally', 
    phone: '(570)404-5231', 
    email: 'sally@sally.com', 
    imageUrl: 'image11.com',
    communicationMedium: 'email',
    passwordHash: 'password1234'
  });
});
  
afterAll(async() => {
  await mongoose.connection.close();
  return mongod.stop();
});

describe('vote routes', () => {

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

  it('updates a vote if it already exists with POST', async() => {

    const vote = await Vote.create ({
      poll: poll.id,
      user: userOne.id,
      options: 'No',
    });

    return request(app)
      .post('/api/v1/votes')
      .send({
        poll: poll.id,
        user: userOne.id,
        options: 'Yes',
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: vote.id,
          poll: poll.id,
          user: userOne.id, 
          options: 'Yes',
          __v: 0
        });
      });

  });

  it('updates a vote by id via PATCH', () => {
    return Vote.create({
      poll: poll.id,
      user: userOne.id,
      options: 'Yes',
    })
      .then(vote => {
        return request(app)
          .patch(`/api/v1/votes/${vote._id}`)
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
