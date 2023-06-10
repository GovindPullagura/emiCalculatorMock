const express = require("express");
const bcrypt = require("bcrypt");
const { UserModel } = require("../models/user.model");
const jwt = require("jsonwebtoken");

const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await UserModel.findOne({ email });
    if (user) {
      res.status(400).send("User exists. Try Login using the email.");
    } else {
      bcrypt.hash(password, 3, async (err, hash) => {
        let newUser = new UserModel({ name, email, password: hash });
        await newUser.save();
      });
      res.send("User registered successfully.");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (user) {
      bcrypt.compare(password, user.password, function (err, result) {
        if (result) {
          var token = jwt.sign({ foo: "bar" }, "mock11");
          const { name, email } = user;
          res.send({ msg: "Loggedin successfully.", token, name, email });
        } else {
          res.send("Incorrect Password");
        }
      });
    } else {
      res.status(400).send("User does not exist.");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

userRouter.post("/calculateEmi", (req, res) => {
  const P = req.body.amount;
  const r = req.body.rate / 12 / 100;
  const n = req.body.tenure;

  let emi = Math.ceil((P * r * (1 + r) ** n) / ((1 + r) ** n - 1));
  let interest = emi * n;
  let total = interest + P;
  res.send({ emi, total, interest });
});

module.exports = { userRouter };
