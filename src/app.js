const express = require('express');
const { connectDb } = require('./config/database');
const { UserModel } = require('./models/user');
const { default: mongoose } = require('mongoose');
const app = express();

app.use(express.json());

app.post('/signin', async (req, res) => {
  const user = req.body;
  console.log(user);

  try {
    const User = new UserModel(user);
    await User.save()
      .then(() => {
        console.log('Successfully registered new user');
        res.send('User registered');
      })
      .catch((err) => {
        console.log('error : ', err.message);
      });
  } catch (err) {
    res.status(400).send('Registratin failed');
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

app.patch('/user', async (req, res) =>{
    const userEmailId = req.body.emailId;
    const data = req.body;

    try{
        const user = await UserModel.findOneAndUpdate(
          { emailId: userEmailId },
          data
        );
        console.log(user);
        if(!user) res.status(400).send("User not found");
        else res.send("user successfully updated");
    }
    catch(err){
        res.status(400).send("Failed to update user");
    }
    
})

connectDb()
  .then(() => {
    console.log('Database successfully connected');
    app.listen(3000, () => {
      console.log('Successfully running on port 3000');
    });
  })
  .catch((err) => {
    console.log('Database connection failed, error : ', err.message);
  });
