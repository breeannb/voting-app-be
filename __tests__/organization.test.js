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
          imageUrl: 'image1.com'
        });
      });
  });

  it('gets all organizations via GET', () => {
    return Organization.create({
      title: 'Environmental Voter Project 1', 
      description: 'description1', 
      imageUrl: 'image1.com', 
    })
      .then(() => request(app).get('/api/v1/organizations'))
      .then(res => {
        expect(res.body).toEqual([{
          _id: expect.anything(),
          title: 'Environmental Voter Project 1', 
          imageUrl: 'image1.com'
        }]);
      });
  });

  it('gets an organization by id with GET', () => {
    return Organization.create({
      title: 'Environmental Voter Project 1', 
      description: 'description1', 
      imageUrl: 'image1.com', 
    })
      .then(organization => request(app).get(`/api/v1/organizations/${organization._id}`))
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          title: 'Environmental Voter Project 1', 
          description: 'description1', 
          imageUrl: 'image1.com',
          __v: 0
        });
      });

  }); 
  
  it('updates organization by id using PATCH', () => {
    return Organization.create({
      title: 'Environmental Voter Project 1', 
      description: 'description1', 
      imageUrl: 'image1.com',
    })
      .then(organization => {
        return request(app)
          .patch(`/api/v1/organizations/${organization._id}`)
          .send({ description: 'description2', imageUrl: 'image2.com' });
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          title: 'Environmental Voter Project 1', 
          description: 'description2', 
          imageUrl: 'image2.com',
          __v: 0
        });
      });
  });

  it('deletes an organization by id via DELETE', () => {
    return Organization.create(
      { 
        title: 'Environmental Voter Project 1', 
        description: 'description1', 
        imageUrl: 'image1.com',
      })
      .then(organization => request(app).delete(`/api/v1/organizations/${organization._id}`))
      .then(res => { 
        expect(res.body).toEqual({
          _id: expect.anything(),
          title: 'Environmental Voter Project 1', 
          description: 'description1', 
          imageUrl: 'image1.com',
          __v: 0
        });
      });
  });
}); 
