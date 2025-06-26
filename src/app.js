const express = require('express');
const { connectDb } = require('./config/database');
const { UserModel } = require('./models/user');
const { default: mongoose } = require('mongoose');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { validateUserData } = require('./util/validateSignup');
const { userAuth } = require('./middlewares/userAuth');

const app = express();

app.use(express.json());
app.use(cookieParser());

app.post('/signup', async (req, res) => {
  console.log(req.body);

  try {
    validateUserData(req);

    const {
      firstName,
      lastName,
      emailId,
      password,
      age,
      gender,
      photoUrl,
      about,
      skills,
    } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);

    const User = new UserModel({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      age,
      gender,
      photoUrl,
      about,
      skills,
    });
    await User.save()
      .then(() => {
        console.log('Successfully registered new user');
        res.send('User registered');
      })
      .catch((err) => {
        console.log('error : ', err.message);
        res.status(400).send('Registration failed : ' + err.message);
      });
  } catch (err) {
    res.status(400).send('Registratin failed : ' + err.message);
  }
});

app.post('/login', async (req, res) => {
  const { emailId, password } = req.body;

  try {
    if (!emailId || !password) throw new Error('Invalid credentials');

    const user = await UserModel.findOne({ emailId });
    if (!user) throw new Error('Invalid credentials');

    const isValid = await user.validatePassword(password);
    if (!isValid) throw new Error('Invalid credentials');

    const token = user.getJWT();

    res.cookie('token', token);
    res.send(user);
  } catch (err) {
    res.status(400).send('ERROR : ' + err.message);
  }
});

app.get('/profile', userAuth, (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send(err);
  }
});

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
