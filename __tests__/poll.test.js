const { MongoMemoryServer } = require('mongodb-memory-server'); 
const mongod = new MongoMemoryServer(); 
const mongoose = require('mongoose'); 
const connect = require('../lib/utils/connect'); 

const request = require('supertest'); 
const app = require('../lib/app'); 
const Poll = require('../lib/models/Poll'); 
const Organization = require('../lib/models/Organization'); 
const User = require('../lib/models/User');
const Vote = require('../lib/models/Vote');

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

  let userTwo;
  beforeEach(async() => {
    userTwo = await User.create({
      name: 'Sam', 
      phone: '(570)404-5232', 
      email: 'sam@sam.com', 
      imageUrl: 'image12.com',
      communicationMedium: 'email'
    });
  });

  afterAll(async() => {
    await mongoose.connection.close();
    return mongod.stop();
  });

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

  it('gets a poll by id via GET', () => {
    return Poll.create({
      organization: organization._id,
      title: 'A Poll to Save Older Forests, the Owl\'s Habitat',
      description: 'A vote for the Owls, please give a Hoot', 
      options: 'Yes', 
      __v: 0
    })
      .then(poll => request(app).get(`/api/v1/polls/${poll._id}`))
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          organization: {
            _id: organization.id,
            title: 'Environmental Organization for Voters',
            description: 'A Voting Party for Environmental Factors',
            imageUrl: 'image1.com'
          },
          title: 'A Poll to Save Older Forests, the Owl\'s Habitat',
          description: 'A vote for the Owls, please give a Hoot', 
          options: 'Yes',
          __v: 0
        });
      });
  });
  
  it('updates a poll by id via PATCH', () => {
    return Poll.create({
      organization: organization._id,
      title: 'A Poll to Save Older Forests, the Owl\'s Habitat',
      description: 'A vote for the Owls, please give a Hoot', 
      options: 'Yes', 
      __v: 0
    })
      .then(poll => {
        return request(app)
          .patch(`/api/v1/polls/${poll._id}`)
          .send({ title: 'A Whole New Title', description: 'A Whole New Description' });
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          organization: organization.id,
          title: 'A Whole New Title',
          description: 'A Whole New Description', 
          options: 'Yes', 
          __v: 0
        });
      });
  });
 
  // it('deletes a polls by id via DELETE', () => {
  //   return Poll.create({
  //     organization: organization._id,
  //     title: 'A Poll to Save Older Forests, the Owl\'s Habitat',
  //     description: 'A vote for the Owls, please give a Hoot', 
  //     options: 'Yes', 
  //     __v: 0
  //   })
  //     .then(poll => request(app).delete(`/api/v1/polls/${poll._id}`))
  //     .then(res => {
  //       expect(res.body).toEqual({
  //         _id: expect.anything(),
  //         organization: organization.id,
  //         title: 'A Poll to Save Older Forests, the Owl\'s Habitat',
  //         description: 'A vote for the Owls, please give a Hoot', 
  //         options: 'Yes', 
  //         __v: 0
  //       });
  //     });
  // });

  //deletes a poll and then deletes votes associated with poll 

  it('deletes a poll and deletes votes associated with poll', async() => {
    const organization = await Organization.create({
      title: 'Environmental Voter Project 1', 
      description: 'description1', 
      imageUrl: 'image1.com'
    });

    const poll = await Poll.create({
      organization: organization._id,
      title: 'Poll 1 Title',
      description: 'Poll 1 Description', 
      options: 'Yes', 
      __v: 0
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
      .delete(`/api/v1/polls/${poll._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          organization: organization.id,
          title: 'Poll 1 Title',
          description: 'Poll 1 Description', 
          options: 'Yes', 
          __v: 0
        });

        return Vote.find({ poll: poll._id });
      })
      .then(votes => {
        expect(votes).toEqual([]);
      });
  });

});
