const validator = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const validationResult = validator.validationResult;

// Import User Model
const UserModel = require("../models/User.model");
const utils = require("../utils/utils");
const mail = require("../services/mail.service");

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

    return res.status(201).json({
      status: "success",
      statusCode: 201,
      message: "Sign Up Succesfull",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: "error",
      statusCode: 500,
      message: "INTERNAL SERVER ERROR",
    });
  }
};

auth.signIn = async (req, res) => {
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
    //Extract Email And Password From the nbody
    const body = req.body;
    const userEmail = body.email;
    const userPassword = body.password;

    // Check If Email Exists
    const user = await UserModel.findOne({
      email: userEmail,
    });

    if (!user) {
      return res.status(400).json({
        status: "error",
        statusCode: 400,
        message: "Invalid credentials",
      });
    }

    // Check Password Ids Correct
    const isPasswordCorrect = await bcrypt.compare(userPassword, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({
        status: "error",
        statusCode: 400,
        message: "Invalid credentials",
      });
    }

    // Generate An Access Token
    const accessToken = await jwt.sign(
      {
        userId: user._id,
        email: userEmail,
      },
      process.env.AUTHENTICATION_SECRET_KEY
    );

    return res.status(200).json({
      status: "success",
      statusCode: 200,
      message: "Sign In Succesfull",
      data: {
        accessToken: accessToken,
      },
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      statusCode: 500,
      message: "INTERNAL SERVER ERROR",
    });
  }
};

auth.getMyProfile = async (req, res) => {
  try {
    const body = req.body;

    const userEmail = body.user.email;
    const userFIrstName = body.user.firstName;
    const userLastName = body.user.lastName;
    const userId = body.user._id;

    return res.status(200).json({
      status: "success",
      statusCode: 200,
      message: "Profile",
      data: {
        user: {
          firstName: userFIrstName,
          lastName: userLastName,
          email: userEmail,
          userId: userId,
        },
      },
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      statusCode: 500,
      message: "INTERNAL SERVER ERROR",
    });
  }
};
// Reset Password
auth.sendTokenToEmail = async (req, res) => {
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
    const userEmail = body.email;

    // Confirm If ther email acttually exists
    const userExist = await UserModel.findOne({
      email: userEmail,
    });
    if (!userExist) {
      return res.status(400).json({
        status: "error",
        statusCode: 400,
        message: "no account associated with this email",
      });
    }

    // If Email Exists Send Email Verification Code

    if (userExist) {
      // generate an authentication code
      const authCode = utils.generateRandomString();

      // Encrypt the code like a password
      const encryptedAuthCode = await bcrypt.hash(authCode, 10);

      // update the users account to have the code
      const updatedUser = await UserModel.findOneAndUpdate(
        {
          email: userEmail,
        },
        {
          authCode: encryptedAuthCode,
        },
        {
          new: true,
        }
      );

      const authToken = await jwt.sign(
        {
          userId: updatedUser._id,
          email: userEmail,
        },
        process.env.AUTHENTICATION_SECRET_KEY
      );
      // finally send the code to the users email
      mail.sendPasswordResetMail({
        recipient: userEmail,
        token: authCode,
      });
      console.log("otp", authCode);
      return res.status(200).json({
        status: "success",
        statusCode: 200,
        message: "Password Reset Email Sent, check your inbox",
        data: {
          authToken: authToken,
        },
      });
    }
  } catch (error) {
    return res.status(400).json({
      status: "error",
      statusCode: 500,
      message: "INTERNAL SERVER ERROR",
    });
  }
};

auth.verifyTokenFromEmail = async (req, res) => {
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
    // eXTRACT AUTH TOKEN AND OTP FROM BODY
    const body = req.body;
    const authToken = body.auth_token;
    const otp = body.otp;
    const newPassword = body.new_password;

    // Check if the token is valid and decode it
    const decodedToken = jwt.verify(
      authToken,
      process.env.AUTHENTICATION_SECRET_KEY
    );
    if (!decodedToken) {
      return res.status(400).json({
        status: "error",
        statusCode: 400,
        message: "Invalid token",
      });
    }

    // extract the user id
    const userId = decodedToken.userId;

    console.log(decodedToken);

    // get the users account using the user id
    const user = await UserModel.findById(userId);

    // check if the otp is correct
    const isOtpCorrect = await bcrypt.compare(otp, user.authCode);
    if (!isOtpCorrect) {
      return res.status(400).json({
        status: "error",
        statusCode: 400,
        message: "Invalid OTP",
      });
    }

    // Hash The NEw Password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    console.log(user);
    // Update Users Acount with new hashed password
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          password: hashedPassword,
        },
      },
      { new: true }
    );
    // await updatedUser.save();

    console.log(updatedUser);
    return res.status(200).json({
      status: "success",
      statusCode: 200,
      message: "Password Updated",
      data: {},
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: "error",
      statusCode: 500,
      message: "INTERNAL SERVER ERROR",
    });
  }
};



module.exports = auth;
