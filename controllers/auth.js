const User = require("../models/User");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ message: "Validation Failed", data: errors.array() });
  }
  bcrypt
    .hash(password, 12)
    .then((hashPassword) => {
      const user = new User({
        email: email,
        password: hashPassword,
        name: name,
      });
      return user.save();
    })
    .then((result) => {
      return res
        .status(201)
        .json({ message: "signup success", userId: result._id });
    })
    .catch((err) => {
      return res.status(500).json({ message: "Could not signup", err: err });
    });
};

exports.login = (req, res, next) => {
  const { email, password } = req.body;
  let loadUser = "";
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        res.status(404).json({ message: "no user found with this email ID" });
      }
      loadUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        status(401).json({ message: "wrong Password" });
      }
      const token = jwt.sign(
        {
          email: loadUser.email,
          userId: loadUser._id.toString(),
        },
        "token",
        { expiresIn: "1h" }
      );
      res.status(200).json({ token: token, userId: loadUser._id.toString() });
    })
    .catch((error) => {
      res.status(500).json({ message: "Could not find" });
    });
};
