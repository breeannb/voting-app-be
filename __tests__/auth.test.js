const { Router } = require('express');
const User = require('../lib/models/User');
const ensureAuth = require('../lib/middleware/ensureAuth');

const setCookie = (user, res) => {
  res.cookie('session', user.authToken(), {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true
  });
};

module.exports = Router();
