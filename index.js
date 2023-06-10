const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { connection } = require("./db");
const { userRouter } = require("./routes/user.route");

const app = express();

app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
  res.send("Home Page");
});

app.use("/users", userRouter);

app.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
  console.log("Listening...");
});
