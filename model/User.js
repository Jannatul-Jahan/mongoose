const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Username was not provided"],
    maxLength: 30,
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Email was not provided"],
  },
  rank: {
    type: Number,
    default: 1,
    min: 1,
    max: 10,
  },
  status: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
