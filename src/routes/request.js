const express = require('express');

const requestRoute = express.Router();

requestRoute.post('/request/interested', (req, res) => {
  res.send('Sent connection request');
});

module.exports = { requestRoute };
