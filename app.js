const express = require("express");
const app = express();
const mongoose = require("mongoose");

const { mongourl } = require("./secret.js");
require("./models/user.js");
const userRouter = require("./routes/auth.js");

const port = 5000;
// connect mongodb
mongoose.connect(mongourl);

// true case
mongoose.connection.on("connected", () => {
  console.log("connected to mongo");
});

//false case
mongoose.connection.on("error", (err) => {
  console.log("error connected to mongo", err);
});

app.get("/", (req, res) => {
  res.send("hello world!");
});
app.use(express.json());
app.use("/api/auth", userRouter);

app.listen(port, () => {
  console.log("server is running");
});
