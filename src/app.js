const express = require('express');
const { connectDb } = require('./config/database');
const { default: mongoose } = require('mongoose');
const cookieParser = require('cookie-parser');
const { authRoute } = require('./routes/auth');
const { profileRoute } = require('./routes/profile');
const { requestRoute } = require('./routes/request');

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/', authRoute, profileRoute, requestRoute);

connectDb()
  .then(async () => {
    console.log('Database successfully connected');
    app.listen(3000, () => {
      console.log('Successfully running on port 3000');
    });
  })
  .catch((err) => {
    console.log('Database connection failed, error : ', err.message);
  });
