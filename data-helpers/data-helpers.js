require('dotenv').config();

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');
const seed = require('./seed');

beforeAll(async() => {
  const uri = await mongod.getUri();
  return connect(uri);
});

beforeEach(() => {
  return mongoose.connection.dropDatabase();
});

beforeEach(() => {
  return seed({ organizations = 5, users = 25, polls = 10, memberships = 5, votes = 100 });
});

afterAll(async() => {
  await mongoose.connection.close();
  return mongod.stop();
});
