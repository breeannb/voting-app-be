// the create route will be used to create a new vote
// the update route will be used to change the voted option 

const { MongoMemoryServer } = require('mongodb-memory-server'); 
const mongod = new MongoMemoryServer(); 
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect.js'); 

const request = require('supertest'); 
const app = require('../lib/app'); 
const Vote = require('../lib/models/Vote.js'); 

describe('user routes', () => {

  it('creates a new vote using POST', () => {

  });
});
