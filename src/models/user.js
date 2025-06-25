const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      maxLength: 50,
    },
    lastName: {
      type: String,
      required: true,
      maxLength: 50,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) throw new Error('Email id not valid');
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
      maxLength: 25,
      validate(value) {
        if (!validator.isStrongPassword(value))
          throw new Error('Weak password detected');
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      lowercase: true,
      validate(value) {
        if (!['male', 'female', 'others'].includes(value))
          throw new Error('Gender is not valid');
      },
    },
    photoUrl: {
      type: String,
      validate(value) {
        if (!validator.isURL(value)) throw new Error('Photo url not found');
      },
    },
    about: {
      type: String,
      default: 'This is a default about section for the user.',
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model('User', userSchema);

module.exports = { UserModel };
