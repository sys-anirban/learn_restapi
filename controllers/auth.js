const User = require("../models/User");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

exports.signup = (req, res, next) => {
  const { name, email, password } = req.body;
  console.log("req", req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ message: "Validation Failed", data: errors.array() });
  }
  bcrypt
    .hash(password, 12)
    .then((hashPassword) => {
      console.log("hashPass", hashPassword);

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
