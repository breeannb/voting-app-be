const { MongoMemoryServer } = require('mongodb-memory-server'); 
const mongod = new MongoMemoryServer(); 
const mongoose = require('mongoose'); 
const connect = require('../lib/utils/connect'); 

const request = require('supertest'); 
const app = require('supertest'); 
const Poll = require('../lib/models/Poll'); 
const Organization = require('../lib/models/Organization'); 

describe('poll routes', () => {

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

  // the create route will be used to create a new poll
  it('', () => {
    return request(app)
  }); 

  

  // the get all route will be used to see all polls for an organization (_id and title only)
  //   it('', () => {
  //     return request(app)
  //   }); 

  // the get by id route will be used to get details about a poll (populate organization information)

  // the update route will be used to update a polls title and/or description

  // the delete route will be used to remove a poll



}); 






