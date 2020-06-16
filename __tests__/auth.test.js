require('dotenv').config();

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');

const request = require('supertest');
const app = require('../lib/app');
const User = require('../lib/models/User');

describe('auth routes', () => {
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

  it('can signup a new user via POST', () => {
    return request(app)
      .post('/api/v1/auth/signup')
      .send({
        email: 'breeanntest@breeanntest.com',
        password: 'password1234'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          email: 'breeanntest@breeanntest.com'
        });
      });
  });
});
