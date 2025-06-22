const express = require('express');
const { adminAuth } = require('./middlewares/auth');
const app = express();

console.log('Hekllo World');

app.get('/admin/getAllData', adminAuth, (req, res) => {
  console.log('getting all data');
  res.send('All data successfully sent');
});

app.delete('/admin/deleteUser', adminAuth, (req, res) => {
  console.log('deleting user');
  res.send('User successfully deleted');
});

app.post('/user/signIn', (req, res) => {
  console.log('signing in user');
  res.send('User successfully signed In');
});

app.use("/user", (req, res, next) => {
    let token = '12345';
    if (token !== '12345') {
      res.status(401).send('Unauthorized access to admin panel');
    } else next();
})

app.get("/user/profile", (req, res) => {
    console.log("Getting user profile");
    res.send("User profile sent");
})


app.listen(3000, () => {
  console.log('Successfully running on port 3000');
});
