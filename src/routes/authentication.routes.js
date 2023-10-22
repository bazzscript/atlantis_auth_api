// Authentication Routes

const express = require("express");
const router = express.Router();

const { body } = require("express-validator");

// Import authentication COntroller
const authController = require("../controller/authentication.controller");

// Import Authentication Midlleware
const authMiddleware = require("../middleware/authentication.middleware");

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

// Sign In Api Route
router.post(
  "/sign_in",

  body("email").isEmail().withMessage("Please enter a valid e-mail address"),

  body("password")
    .isStrongPassword({
      minLength: 10,
    })
    .withMessage("Password must be at least 10 characters"),

  authController.signIn
);

// Get My Profile Api Route
router.get(
  "/my_profile",

  // Middlewares
  authMiddleware.authenticate,

  // Controller
  authController.getMyProfile
);

// Password RESET ROUTES
router.put(
  "/reset_password/send_otp",

  body("email").isEmail().withMessage("Please enter a valid e-mail address"),

  authController.sendTokenToEmail
);
router.put(
  "/reset_password/verify_otp",

  body("auth_token").isString().withMessage("Please enter a valid Auth Token"),
  body("otp").isString().withMessage("Please enter a valid OTP"),

  body("new_password")
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
  authController.verifyTokenFromEmail
);
module.exports = router;
