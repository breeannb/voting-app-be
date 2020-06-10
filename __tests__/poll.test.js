const { MongoMemoryServer } = require('mongodb-memory-server'); 
const mongod = new MongoMemoryServer(); 
const mongoose = require('mongoose'); 
const connect = require('../lib/utils/connect'); 

const request = require('supertest'); 
const app = require('../lib/app'); 
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

  let organization;
  beforeEach(async() => {
    organization = await Organization.create({
      title: 'Environmental Organization for Voters',
      description: 'A Voting Party for Environmental Factors',
      imageUrl: 'image1.com'
    });
  });

  afterAll(async() => {
    await mongoose.connection.close();
    return mongod.stop();
  });

  //   the create route will be used to create a new poll
  it('create a poll via POST', async() => {
    return request(app)
      .post('/api/v1/polls')
      .send({
        organization: organization._id,
        title: 'A Poll to Save Older Forests, the Owl\'s Habitat',
        description: 'A vote for the Owls, please give a Hoot', 
        options: 'Yes', 
        __v: 0
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(), 
          organization: organization.id,
          title: 'A Poll to Save Older Forests, the Owl\'s Habitat',
          description: 'A vote for the Owls, please give a Hoot', 
          options: 'Yes', 
          __v: 0
        });
      });
  });

  // the get all route will be used to see all polls for an organization (_id and title only)
  it('gets all polls via GET', () => {
    return Poll.create({
      organization: organization._id,
      title: 'A Poll to Save Older Forests, the Owl\'s Habitat',
      description: 'A vote for the Owls, please give a Hoot', 
      options: 'Yes', 
      __v: 0
    })
      .then(() => request(app).get('/api/v1/polls'))
      .then(res => {
        expect(res.body).toEqual([{
          _id: expect.anything(), 
          title: 'A Poll to Save Older Forests, the Owl\'s Habitat'
        }]);
      });
  }); 

});



// the get by id route will be used to get details about a poll (populate organization information)

// the update route will be used to update a polls title and/or description

// the delete route will be used to remove a poll
