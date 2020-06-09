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
    
  afterAll(async() => {
    await mongoose.connection.close();
    return mongod.stop();
  });

  //   the create route will be used when a new organization is created
  it('creates an organization via POST', () => {
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
          imageUrl: 'image1.com', 
          __v: 0
        });
      });

  });

  // the get all route will be used to see all organizations (_id, title, and imageUrl of organization only)
  it('can get all organizations via GET', async() => {
    return Organization.create({
      title: 'Environmental Voter Project 1',
      description: 'description1',
      imageUrl: 'image1.com'
    })
      .then(() => request(app).get('/api/v1/organizations'))
      .then(res => { 
        expect(res.body).toEqual([{
          __id: expect.anything(),
          title: 'Environmental Voter Project 1',
          imageUrl: 'image1.com'
        }]);
      });
  });

  // the get by id route will be used to get details about an organization

  // the update route will be used to update organization information

  // the delete route will be used if an organization is disbanded

}); 
