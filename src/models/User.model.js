const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  //FIRST NAME
  firstName: {
    type: String,
    minlength: [2, "First name must be at least 2 characters long"],
    maxlength: [100, "First name must be less than 30 characters"],
    required: true,
  },

  //LAST NAME
  lastName: {
    type: String,
    minlength: [2, "Last name must be at least 2 characters long"],
    maxlength: [100, "Last name must be less than 30 characters"],
    required: true,
  },

  //EMAIL ADDRESS
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true,
    validate: {
      validator:  (value) => {
        // Regular Expression to match An Emial
        return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(value);
      },
      message: "Please enter a valid e-mail address",
    },
  },

  //PASSWORD
  password: {
    type: String,
    // select: false,
    required: [true, 'password is required'],
    min: [8, 'password must be at least 8 characters'],

  },
});

const User = mongoose.model("User", userSchema);

// Export MOdel
module.exports = User;
