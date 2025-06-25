const express = require('express');
const { connectDb } = require('./config/database');
const { UserModel } = require('./models/user');
const { default: mongoose } = require('mongoose');

const app = express();

app.use(express.json());

app.post('/signin', async (req, res) => {
  const user = req.body;
  console.log(user);

  const ALLOWED_FIELD = [
    'firstName',
    'lastName',
    'emailId',
    'password',
    'age',
    'gender',
    'photoUrl',
    'about',
    'skills',
  ];
  try {
    const isAllowed = Object.keys(user).every((key) =>
      ALLOWED_FIELD.includes(key)
    );
    if (!isAllowed) throw new Error('Input fields not allowed');
    if (user?.skills?.length > 10)
      throw new Error('Skills cannot be more than 10');

    const User = new UserModel(user);
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

app.get('/user', async (req, res) => {
  const userEmailId = req.body.emailId;

  try {
    const user = await UserModel.find({ emailId: userEmailId });
    console.log(user);

    if (user) res.send(user);
    else res.status(404).send('user not found');
  } catch (err) {
    console.log('error : ', err.message);
    res.status(400).send('Something went wrong');
  }
});

app.get('/feed', async (req, res) => {
  try {
    const users = await UserModel.find({});
    console.log(users);

    if (users.length) res.send(users);
    else res.status(404).send('user not found');
  } catch (err) {
    console.log('error : ', err.message);
    res.status(400).send('Something went wrong');
  }
});

app.patch('/user', async (req, res) => {
  const userEmailId = req.body.emailId;
  const data = req.body;
  const ALLOWED_FIELD = [
    'firstName',
    'lastName',
    'password',
    'gender',
    'photoUrl',
    'about',
    'skills',
  ];

  try {
    const isAllowed = Object.keys(data).forEach((key) =>
      ALLOWED_FIELD.includes(key)
    );
    if (!isAllowed) throw new Error('Input filels not allowed to be updated');
    if (user?.skills.length > 10)
      throw new Error('Skills cannot be more than 10');

    const user = await UserModel.findOneAndUpdate(
      { emailId: userEmailId },
      data,
      {
        returnDocument: 'after',
        runValidators: true,
      }
    );
    console.log(user);
    if (!user) res.status(400).send('User not found');
    else res.send('user successfully updated');
  } catch (err) {
    res.status(400).send('Failed to update user');
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
