const express = require("express");
const { registerUser, loginUser } = require("../controllers/UserController");
const router = express.Router();

// Login User
router.post("/login", loginUser);

// Register User
router.post("/register", registerUser);

module.exports = router;
