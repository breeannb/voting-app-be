const { MongoMemoryServer } = require('mongodb-memory-server'); 
const mongod = new MongoMemoryServer(); 
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect.js'); 

const request = require('supertest'); 
const app = require('../lib/app'); 
const Membership = require('../lib/models/Membership'); 

describe('membership routes', () => {

  beforeAll(async() => {
    const uri = await mongod.getUri();
    return connect(uri);
  });
    
  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(async() => {
    await mongoose.connection.close();
    return mongod.stop();
  });

  // the create route will be used to create a new membership
  it('create a membership via POST', () => {
    return request(app)
      .post('/api/v1/membership')
      .send({
        organization: 'League of Women Voters Organization',
        user: 'Sally'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          organization: 'League of Women Voters Organization',
          user: 'Sally', 
          __v: 0
        });
      });
  });

  // (/api/v1/memberships?org=ORG_ID) the get all route will be used to see all users in an organization (_id, name, and imageUrl only)

  // if no organization id is provided send an error

  // the delete route will be used to remove a membership 
  
}); 
