const express = require('express');
const { connectDb } = require('./config/database');
const { default: mongoose } = require('mongoose');
const cookieParser = require('cookie-parser');
const { authRouter } = require('./routes/auth');
const { profileRouter } = require('./routes/profile');
const { requestRouter } = require('./routes/request');
const { userRouter } = require('./routes/user');

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/', authRouter, profileRouter, requestRouter, userRouter);

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
