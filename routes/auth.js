const express = require("express");
const { body } = require("express-validator");
const User = require("../models/User");
const authController = require("../controllers/auth");
const router = express.Router();

router.put(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a Valid email")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          return Promise.reject("Email already exist");
        });
      })
      .normalizeEmail(),
    body("password")
      .trim()
      .isLength({ min: 8 })
      .withMessage("minimum eight character long"),
    body("name").trim().not().isEmpty(),
  ],
  authController.signup
);

module.exports = router;
