const express = require('express');
const { userAuth } = require('../middlewares/userAuth');
const userRouter = express.Router();
const { Connection } = require('../models/connectionRequest');
const { UserModel } = require('../models/user');

const ALLOWED_USER_DATA = [
  'firstName',
  'lastName',
  'age',
  'photoUrl',
  'gender',
  'about',
  'skills',
];

userRouter.get('/user/request/received', userAuth, async (req, res) => {
  try {
    const user = req.user;

    const requests = await Connection.find({
      toUserId: user._id,
      status: 'interested',
    }).populate('fromUserId', ALLOWED_USER_DATA);

    if (!requests) throw new Error('No request found');

    res.json({
      message: 'Data fetched successfully',
      data: requests,
    });
  } catch (err) {
    res.status(400).json({
      message: 'ERROR : ' + err.message,
    });
  }
});

userRouter.get('/user/request/connections', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const requests = await Connection.find({
      $or: [
        { fromUserId: loggedInUser._id, status: 'accepted' },
        { toUserId: loggedInUser._id, status: 'accepted' },
      ],
    })
      .populate('fromUserId', ALLOWED_USER_DATA)
      .populate('toUserId', ALLOWED_USER_DATA);

    const data = requests.map((row) => {
      if (row.fromUserId._id.equals(loggedInUser._id)) return row.toUserId;
      return row.fromUserId;
    });

    res.json({ message: 'Data received successfully', data });
  } catch (err) {
    res.json({ message: 'ERROR : ' + err.message });
  }
});

userRouter.get('/user/feed', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 30 ? 30 : limit;
    const skip = (page - 1) * limit;

    const requests = await Connection.find({
      $or: [{ fromUserId: loggedInUser }, { toUserId: loggedInUser }],
    }).select(['fromUserId', 'toUserId']);
    let hiddenUsersFromFeed = new Set();

    requests.every((row) => {
      hiddenUsersFromFeed.add(row.fromUserId);
      hiddenUsersFromFeed.add(row.toUserId);
    });

    const filteredFeed = await UserModel.find({
      $and: [
        { _id: { $nin: Array.from(hiddenUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(ALLOWED_USER_DATA)
      .skip(skip)
      .limit(limit);

    res.json({ message: 'Data fetched successfully', data: filteredFeed });
  } catch (err) {
    res.status(400).json({ message: 'ERROR : ' + err.message });
  }
});

module.exports = { userRouter };
