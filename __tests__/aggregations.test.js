require('dotenv').config();
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');
const seed = require('../data-helpers/seed');
const User = require('../lib/models/User');
const request = require('supertest');
const app = require('../lib/app');


beforeAll(async() => {
  const uri = await mongod.getUri();
  return connect(uri);
});

beforeEach(() => {
  return mongoose.connection.dropDatabase();
});

beforeEach(() => {
  return seed();
});

const agent = request.agent(app);

beforeEach(async() => {

  await User.create({
    name: 'Sally', 
    phone: '(570)404-5231', 
    email: 'sally@sally.com', 
    imageUrl: 'image11.com',
    communicationMedium: 'email',
    password: 'password1234'
  });

  return agent
    .post('/api/v1/Users/login')
    .send({
      name: 'Sally', 
      phone: '(570)404-5231', 
      email: 'sally@sally.com', 
      imageUrl: 'image11.com',
      communicationMedium: 'email',
      password: 'password1234'
    });
});

afterAll(async() => {
  await mongoose.connection.close();
  return mongod.stop();
});

describe('aggregation routes', () => {
  it('gets the amount of votes per option', async() => {
    return agent
      .get('/api/v1/votes/voteamount')
      .then(res => {
        expect(res.body).toEqual([
          { '_id': expect.anything(), 'count': expect.anything() },
          { '_id': expect.anything(), 'count': expect.anything() },
          { '_id': expect.anything(), 'count': expect.anything() }]);
      });
  });
});
