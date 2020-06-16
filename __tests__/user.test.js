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

  let userOne;
  beforeEach(async() => {
    userOne = await User.create({
      name: 'Breeann B',
      phone: '(570)404-5230', 
      email: 'bolinskybm10@gmail.com',
      imageUrl: 'image10.com',
      communicationMedium: 'email',
      passwordHash: 'password1234'
    });
  });
    
  afterAll(async() => {
    await mongoose.connection.close();
    return mongod.stop();
  });

  it('gets all user info and organizations by id via GET', () => {
    return User.create({
      name: 'Breeann B',
      phone: '(570)404-5230', 
      email: 'bolinskybm10@gmail.com',
      imageUrl: 'image10.com',
      communicationMedium: 'email',
      passwordHash: 'password1234'
    })
      .then(user => request(app).get(`/api/v1/users/${user._id}`))
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          name: 'Breeann B',
          memberships: [],
          phone: '(570)404-5230', 
          email: 'bolinskybm10@gmail.com',
          imageUrl: 'image10.com',
          communicationMedium: 'email'
        });
      });
  });

  it('updates user by id using PATCH', () => {
    return User.create({
      name: 'Breeann B',
      phone: '(570)404-5230', 
      email: 'bolinskybm10@gmail.com',
      imageUrl: 'image10.com',
      communicationMedium: 'email',
      passwordHash: 'password1234'
    })
      .then(user => {
        return request(app)
          .patch(`/api/v1/users/${user._id}`)
          .send({ communicationMedium: 'phone' });
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          name: 'Breeann B',
          phone: '(570)404-5230', 
          email: 'bolinskybm10@gmail.com',
          imageUrl: 'image10.com',
          communicationMedium: 'phone'
        });
      });
  });

  it('deletes an user by id via DELETE', () => {
    return User.create(
      { 
        name: 'Breeann B',
        phone: '(570)404-5230', 
        email: 'bolinskybm10@gmail.com',
        imageUrl: 'image10.com',
        communicationMedium: 'email',
        passwordHash: 'password1234'
      })
      .then(user => request(app).delete(`/api/v1/users/${user._id}`))
      .then(res => { 
        expect(res.body).toEqual({
          _id: expect.anything(),
          name: 'Breeann B',
          phone: '(570)404-5230', 
          email: 'bolinskybm10@gmail.com',
          imageUrl: 'image10.com',
          communicationMedium: 'email'
        });
      });
  });
}); 
