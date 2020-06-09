const { MongoMemoryServer } = require('mongodb-memory-server'); 
const mongod = new MongoMemoryServer(); 
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect.js'); 

const request = require('supertest'); 
const app = require('../lib/app'); 
const User = require('../lib/models/User.js'); 

describe('user routes', () => {

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

  it('gets an user by id via GET', () => {
    return User.create({
      name: 'Breeann B',
      phone: '(570)404-5230', 
      email: 'bolinskybm10@gmail.com',
      communicationMedium: 'email'
    })
      .then(user => request(app).get(`api/v1/users/${user._id}`))
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          name: 'Breeann B',
          phone: '(570)404-5230', 
          email: 'bolinskybm10@gmail.com',
          communicationMedium: 'email',
          __v: 0
        });
      });
  });


}); 
