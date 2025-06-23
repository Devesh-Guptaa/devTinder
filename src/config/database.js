const URL =
  'mongodb+srv://deveshgupta231:ELz5TRXXrGMq9XFn@cluster0.1bxbjeo.mongodb.net/devTinder';

const mongoose = require('mongoose');

const connectDb = async () => {
  await mongoose.connect(URL);
};

module.exports = { connectDb };
