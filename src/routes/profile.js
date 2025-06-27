const express = require('express');
const { UserModel } = require('../models/user');
const { userAuth } = require('../middlewares/userAuth');

const profileRoute = express.Router();

profileRoute.get('/profile', userAuth, (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = { profileRoute };
