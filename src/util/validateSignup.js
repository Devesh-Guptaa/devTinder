const validator = require('validator');

function validateUserData(req) {
  const { firstName, lastName, password, emailId } = req.body;
  const ALLOWED_FIELD = [
    'firstName',
    'lastName',
    'emailId',
    'password',
    'age',
    'gender',
    'photoUrl',
    'about',
    'skills',
  ];

  const isAllowed = Object.keys(req.body).every((key) =>
    ALLOWED_FIELD.includes(key)
  );
  if (!isAllowed) throw new Error('Input fields not allowed');
  if (req.body?.skills?.length > 10)
    throw new Error('Skills cannot be more than 10');

  if (!validator.isEmail(emailId)) throw new Error("Invalid emailId");
  else if(!validator.isStrongPassword(password)) throw new Error('Weak Password');
  else if(!firstName || !lastName) throw new Error('Invalid name');
}

module.exports = {validateUserData};
