const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ['interested', 'ignored', 'accepted', 'rejected'],
        message: '{VALUE} is not a valid status',
      },
    },
  },
  {
    timestamps: true,
  }
);

connectionRequestSchema.pre('save', function (next) {
  const connection = this;
  if (connection.fromUserId.equals(connection.toUserId))
    throw new Error('Cannot send connection request to itself');
  next();
});

const Connection = mongoose.model('connection', connectionRequestSchema);

module.exports = { Connection };
