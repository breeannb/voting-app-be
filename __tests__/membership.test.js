const { MongoMemoryServer } = require('mongodb-memory-server'); 
const mongod = new MongoMemoryServer(); 
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect.js'); 

const request = require('supertest'); 
const app = require('../lib/app'); 
const Membership = require('../lib/models/Membership'); 
const Organization = require('../lib/models/Organization');
const User = require('../lib/models/User');
const Vote = require('../lib/models/Vote');
const Poll = require('../lib/models/Poll');

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

let userTwo;
beforeEach(async() => {
  userTwo = await User.create({
    name: 'Sam', 
    phone: '(570)404-5232', 
    email: 'sam@sam.com', 
    imageUrl: 'image12.com',
    communicationMedium: 'email',
    passwordHash: 'password5678'
  });
});

afterAll(async() => {
  await mongoose.connection.close();
  return mongod.stop();
});

describe('membership routes', () => {

  it('creates a membership via POST', async() => {

    return request(app)
      .post('/api/v1/memberships')
      .send({
        organization: organization.id,
        user: userOne.id,
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          organization: organization.id,
          user: userOne.id, 
          __v: 0
        });
      });
      
  });

  it('can get all users(pizzas) with a particular organization via GET', async() => {
    await Membership.create([
      {
        organization: organization._id,
        user: userOne._id
      }, 
      {
        organization: organization._id,
        user: userTwo._id
      }
    ]);
    return request(app)
      .get(`/api/v1/memberships?organization=${organization._id}`)
      .then(res => {
        expect(res.body).toEqual([{
          _id: expect.anything(),
          organization: expect.anything(),
          user: {
            _id: userOne.id, 
            name: 'Sally', 
            imageUrl: 'image11.com'
          }, 
          __v: 0
        }, {
          _id: expect.anything(),
          organization: expect.anything(),
          user: {
            _id: userTwo.id,
            name: 'Sam', 
            imageUrl: 'image12.com'
          }, 
          __v: 0
        }]);
      });
  });

  it('deletes an membership and all votes made by that member', async() => {
    const membership = await Membership.create({
      organization: organization.id,
      user: userOne.id, 
    });

    const poll = await Poll.create({
      organization: organization._id,
      title: 'A Poll to Save Older Forests, the Owl\'s Habitat',
      description: 'A vote for the Owls, please give a Hoot', 
      options: 'Yes'
    });

    await Vote.create([
      {
        poll: poll.id,
        user: userOne.id,
        options: 'Yes',
      },
      {
        poll: poll.id,
        user: userTwo.id,
        options: 'Yes',
      }
    ]);

    return request(app)
      .delete(`/api/v1/memberships/${membership._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          organization: organization.id,
          user: userOne.id,
          __v: 0
        });

        return Vote.find({ membership: membership._id });
      })
      .then(votes => {
        expect(votes).toEqual([]);
      });
  });
  
});
