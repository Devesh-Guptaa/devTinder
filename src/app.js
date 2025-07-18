const dotenv = require('dotenv').config({ quiet: true });
const express = require('express');
const { connectDb } = require('./config/database');
const { default: mongoose } = require('mongoose');
const cookieParser = require('cookie-parser');
const { authRouter } = require('./routes/auth');
const { profileRouter } = require('./routes/profile');
const { requestRouter } = require('./routes/request');
const { userRouter } = require('./routes/user');
const cors = require('cors');

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

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
