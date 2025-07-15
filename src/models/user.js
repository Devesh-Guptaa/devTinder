const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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
      default:
        'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
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

userSchema.methods.getJWT = function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, 'keyisscret');
  return token;
};

userSchema.methods.validatePassword = async function (passwordByUser) {
  const user = this;
  const isPasswordCorrect = await bcrypt.compare(passwordByUser, user.password);
  return isPasswordCorrect;
};

const UserModel = mongoose.model('User', userSchema);

module.exports = { UserModel };
