const jwt = require('jsonwebtoken');
const { UserModel } = require('../models/user');

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) throw new Error('Token not available');

    const { _id } = jwt.verify(token, process.env.JWT_SECRET);
    if (!_id) throw new Error('Invalid token');

    const user = await UserModel.findById({ _id });
    if (!user) throw new Error('Invalid token');

    req.user = user;
    next();
  } catch (err) {
    res.status(401).send('ERROR : ' + err.message);
  }
};

module.exports = { userAuth };
