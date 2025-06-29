const patchValidator = (data) => {
  const ALLOWED_EDIT_FIELDS = [
    'firstName',
    'lastName',
    'age',
    'gender',
    'photoUrl',
    'about',
    'skills',
  ];

  const isAllowed = Object.keys(data).every((field) =>
    ALLOWED_EDIT_FIELDS.includes(field)
  );
  return isAllowed;
};

module.exports = { patchValidator };
