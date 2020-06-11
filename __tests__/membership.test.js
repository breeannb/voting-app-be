const { MongoMemoryServer } = require('mongodb-memory-server'); 
const mongod = new MongoMemoryServer(); 
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect.js'); 

const request = require('supertest'); 
const app = require('../lib/app'); 
const Organization = require('../lib/models/Organization'); 

describe('organization routes', () => {

  beforeAll(async() => {
    const uri = await mongod.getUri();
    return connect(uri);
  });
    
  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });
  
  // let poll; 
  // beforeEach(async() => {
  //   poll = await poll.create({
  //     create
  //   });
  // }); 

  afterAll(async() => {
    await mongoose.connection.close();
    return mongod.stop();
  });

  // the create route will be used to create a new membership
  it('creates a membership via POST', () => {
    return request(app)
      .post('/api/v1/organizations')
      .send({
        title: 'Environmental Voter Project 1',
        description: 'description1',
        imageUrl: 'image1.com'
      })
      .then (res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          title: 'Environmental Voter Project 1', 
          description: 'description1', 
          imageUrl: 'image1.com'
        });
      });
  }); 

  // (/api/v1/memberships?org=ORG_ID) the get all route will be used to see all users in an organization (_id, name, and imageUrl only)

  // if no organization id is provided send an error

  // the delete route will be used to remove a membership 
  
}); 
