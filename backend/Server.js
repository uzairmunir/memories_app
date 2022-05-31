const express = require("express");
const ConnectDB = require("./config/db");
const app = express();
const dotenv = require("dotenv").config();
const cors = require("cors");

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

//PORT
const PORT = process.env.PORT || 5000;

// express server default middleware
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ extended: false }));

//Routes
app.use("/api/posts", require("./routes/PostRoutes"));
app.use("/api/users/", require("./routes/UserRoutes"));

// Connect to Database
ConnectDB();
// Listen To Server
app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
