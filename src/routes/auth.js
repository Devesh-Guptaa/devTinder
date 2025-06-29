const express = require('express');
const { UserModel } = require('../models/user');
const { validateUserData } = require('../util/validateSignup');
const bcrypt = require('bcrypt');

const authRouter = express.Router();

authRouter.post('/signup', async (req, res) => {
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

authRouter.post('/login', async (req, res) => {
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

authRouter.post('/logout', (req, res) => {
  res
    .cookie('token', null, { expiresIn: new Date(Date.now()) })
    .send('Logout successfully');
});

module.exports = { authRouter };
