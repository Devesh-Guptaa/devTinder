const express = require('express');
const { UserModel } = require('../models/user');
const { userAuth } = require('../middlewares/userAuth');
const { patchValidator } = require('../util/validatePatch');
const bcrypt = require('bcrypt');

const profileRouter = express.Router();

profileRouter.get('/profile/view', userAuth, (req, res) => {
  try {
    const user = req.user;
    res.json({ messgage: 'Data fetched successfully', data: user });
  } catch (err) {
    res.status(400).send(err);
  }
});

profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
  const user = req.user;

  try {
    if (!patchValidator(req.body)) throw new Error('Invalid update');
    Object.keys(req.body).every((field) => (user[field] = req.body[field]));

    await user.save();

    res.json({
      message: `${user.firstName}'s record is successfully updated`,
      data: user,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

profileRouter.patch('/profile/password', userAuth, async (req, res) => {
  const user = req.user;
  const { password } = req.body;

  try {
    const pasworHash = await bcrypt.hash(password, 10);
    user.password = pasworHash;
    await user.save();

    res.json({ message: `${user.firstName}'s password updated successfully` });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = { profileRouter };
