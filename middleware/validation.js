const { body, query, param } = require("express-validator");

const userValidator = {
  create: [
    body("name")
      .exists()
      .withMessage("Name was not provided")
      .bail()
      .notEmpty()
      .withMessage("Name cannot be empty")
      .bail()
      .isString()
      .withMessage("Name must be a string")
      .isLength({ max: 30 })
      .withMessage("Name cannot be more than 30 characters"),
    body("email")
      .exists()
      .withMessage("Email was not provided")
      .bail()
      .notEmpty()
      .withMessage("Email cannot be empty")
      .bail()
      .isString()
      .withMessage("Email must be a string")
      .bail()
      .isEmail()
      .withMessage("Email format is incorrect"),
  ],
};

module.exports = { userValidator };
