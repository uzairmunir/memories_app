const User = require("../models/UserModal");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const auth = asyncHandler(async (req, res, next) => {
  const token = req.header("auth-token");
  const isCustomAuth = token.length < 500;
  console.log(token.length);
  if (token && isCustomAuth) {
    let decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decodedData?.id;
    console.log(req.userId);
  } else {
    let decodedData = jwt.decode(token);
    req.userId = decodedData?.sub;
    console.log(req.userId);
  }
  next();
  if (!token) {
    res.status(400).json({ message: "Authorization Denied Token Missing" });
  }
});

module.exports = auth;
