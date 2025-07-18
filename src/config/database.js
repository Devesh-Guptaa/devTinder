const URL = process.env.DATABASE_CONNECTION_URL;

const mongoose = require('mongoose');

const connectDb = async () => {
  await mongoose.connect(URL);
};

module.exports = { connectDb };
