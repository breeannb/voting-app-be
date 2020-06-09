const express = require('express');
const app = express();

app.use(express.json());

//need to change this line to something that is relevant to voting app, in this case I changed it to votes
app.use('/api/v1/organizations', require('./routes/organizations'));
app.use('/api/v1/users', require('./routes/users'));

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
