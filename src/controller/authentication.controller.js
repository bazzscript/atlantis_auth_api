const validator = require("express-validator");
const bcrypt = require('bcrypt');

const validationResult = validator.validationResult;

// Import User Model
const UserModel = require("../models/User.model");

const auth = {};

// Authentication
auth.signUp = async (req, res) => {
  // Cathc ANd Return TO CLient All Errors THrown By Express-Validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "error",
      statusCode: 400,
      message: errors.array(),
    });
  }

  try {
    const body = req.body;

    const firstName = body.first_name;
    const lastName = body.last_name;
    const userEmail = body.email;
    const userPassword = body.password;

    // Confirm Users Email Does Noty Exist Already
    const userEmailExists = await UserModel.findOne({
      email: userEmail,
    });
    if (userEmailExists) {
      return res.status(400).json({
        status: "error",
        statusCode: 400,
        message: "Email already exists",
      });
    }


    // Hash Users Password
    const hashedPassword = await bcrypt.hash(userPassword, 10);

    // Create A New User And Save To Db
    const newUser = await UserModel.create({
      firstName: firstName,
      lastName: lastName,
      email: userEmail,
      password: hashedPassword,
    });
console.log(newUser);


    return res.status(201).json({
      status: "success",
      statusCode: 201,
      message: "Sign Up Succesfull",
    });
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      status: "error",
      statusCode: 500,
      message: "INTERNAL SERVER ERROR",
    });
  }
};

auth.signIn = (req, res) => {};

// Reset Password
auth.sendTokenToEmail = (req, res) => {};

auth.verifyTokenFromEmail = (req, res) => {};


module.exports = auth;
