const { MongoMemoryServer } = require('mongodb-memory-server'); 
const mongod = new MongoMemoryServer(); 
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect.js'); 
const request = require('supertest'); 
const app = require('../lib/app'); 
const Organization = require('../lib/models/Organization'); 
const Poll = require('../lib/models/Poll'); 

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

  it('gets an organization by id with memberships with GET', () => {
    return Organization.create({
      title: 'Environmental Voter Project 1', 
      description: 'description1', 
      imageUrl: 'image1.com', 
    })
      .then(organization => request(app).get(`/api/v1/organizations/${organization._id}`))
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          memberships: [],
          title: 'Environmental Voter Project 1', 
          description: 'description1', 
          imageUrl: 'image1.com'
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
          imageUrl: 'image2.com'
        });
      });
  });

  it('deletes an owner and all organizations and polls associated with owner', async() => {
    const organization = await Organization.create({
      title: 'Environmental Voter Project 1', 
      description: 'description1', 
      imageUrl: 'image1.com'
    });

    await Poll.create([
      {
        organization: organization._id,
        title: 'Poll 1 Title',
        description: 'Poll 1 Description', 
        options: 'Yes', 
        __v: 0
      },
      {
        organization: organization._id,
        title: 'Poll 2 Title',
        description: 'Poll 2 Description', 
        options: 'Yes', 
        __v: 0
      }
    ]);

    return request(app)
      .delete(`/api/v1/organizations/${organization._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          title: 'Environmental Voter Project 1', 
          description: 'description1', 
          imageUrl: 'image1.com'
        });

        return Poll.find({ organization: organization._id });
      })
      .then(polls => {
        expect(polls).toEqual([]);
      });
  });

}); 
