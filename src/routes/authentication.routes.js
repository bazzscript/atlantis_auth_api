// Authentication Routes

const express = require("express");
const router = express.Router();

const { body } = require("express-validator");

// Import authentication COntroller
const authController = require("../controller/authentication.controller");

// Sign Up Api Route
router.post(
  "/sign_up",
  body("first_name")
    .isString()
    .isLength({
      min: 3,
      max: 100,
    })
    .withMessage(
      "required and must be at least 3 characters long and must not be more than 100 characters"
    ),

    body("last_name")
    .isString()
    .isLength({
      min: 3,
      max: 100,
    })
    .withMessage(
      "required and must be at least 3 characters long and must not be more than 100 characters"
    ),
  body("email").isEmail().withMessage("Please enter a valid e-mail address"),

  body("password")
    .isStrongPassword({
      minLength: 10,
      minLowercase: 1,
      minNumbers: 1,
      minUppercase: 1,
      minSymbols: 1,
    })
    .withMessage(
      "Password must be at least 10 characters and must contain at least one lowercase, uppercase, number, and symbol"
    ),

  authController.signUp
);

module.exports = router;
