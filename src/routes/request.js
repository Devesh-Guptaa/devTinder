const express = require('express');
const { Connection } = require('../models/connectionRequest');
const { userAuth } = require('../middlewares/userAuth');
const { UserModel } = require('../models/user');
const { sendEmail } = require('../util/sesSendEmail');
const requestRouter = express.Router();

requestRouter.post(
  '/request/send/:status/:userId',
  userAuth,
  async (req, res) => {
    try {
      const senderUser = req.user;

      const fromUserId = senderUser._id;
      const toUserId = req.params.userId;
      const status = req.params.status;

      const ALLOWED_STATUS = ['interested', 'ignored'];
      const isAllowed = ALLOWED_STATUS.includes(status);
      if (!isAllowed) throw new Error('Invalid status');

      const toUser = await UserModel.findById(toUserId);
      if (!toUser) throw new Error('User not found');

      const duplicateRequest = await Connection.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (duplicateRequest) throw new Error('request already exists');

      const connection = new Connection({
        fromUserId,
        toUserId,
        status,
      });

      const response = await sendEmail(toUser.firstName);

      await connection.save();
      res.json({
        message: 'Connection request successfully sent',
      });
    } catch (err) {
      res.status(400).json({
        message: 'ERROR : ' + err.message,
      });
    }
  }
);

requestRouter.post(
  '/request/review/:status/:requestId',
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;

      const { status, requestId } = req.params;

      const ALLOWED_STATUS = ['accepted', 'rejected'];
      const isAllowed = ALLOWED_STATUS.includes(status);
      if (!isAllowed) throw new Error('Invalid status');

      const request = await Connection.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: 'interested',
      });
      if (!request) throw new Error('Invalid request');

      request.status = status;
      await request.save();

      res.json({ message: 'Request is ' + status });
    } catch (err) {
      res.status(400).json({ message: 'ERROR : ' + err.message });
    }
  }
);

module.exports = { requestRouter };
