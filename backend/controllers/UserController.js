const User = require("../models/UserModal");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");

//@method  POST
//access   Public
//@desc    Register User
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  // Check for required fields
  if (name && email && password && confirmPassword) {
    // Check for existing user
    const user = await User.findOne({ email });
    if (!user) {
      // check for password match
      if (password === confirmPassword) {
        // convert password into hashed
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await User.create({
          name,
          email,
          password: hashedPassword,
        });
        res.status(200).json({
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          token: generateJWT(newUser._id),
        });
      } else {
        res
          .status(404)
          .json({ status: "failed", msg: "password dose not match" });
      }
    } else {
      res.status(400).json({
        status: "failed",
        msg: "User with this email already exists.",
      });
    }
  } else {
    res.status(400).json({ status: "failed", msg: "All fields are required" });
  }
});

//@method  POST
//access   Public
//@desc    LOGIN User
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // Check for required fields
  if (email && password) {
    // Check for User
    const user = await User.findOne({ email });
    if (user) {
      // check for password match
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        res.status(200).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          token: generateJWT(user._id),
        });
      } else {
        res
          .status(400)
          .json({ status: "failed", msg: "Invalid email or password" });
      }
    } else {
      res.status(400).json({
        status: "failed",
        msg: "User with this email dose not exists exists",
      });
    }
  } else {
    res.status(400).json({ status: "failed", msg: "All fields are required" });
  }
});

// Generate JWT Token
const generateJWT = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

module.exports = { registerUser, loginUser };
