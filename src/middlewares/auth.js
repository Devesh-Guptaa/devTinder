const adminAuth = (req, res, next) => {
  let token = '1235';
  if (token !== '12345') {
    res.status(401).send('Unauthorized access to admin panel');
  } else next();
};

module.exports = { adminAuth };
