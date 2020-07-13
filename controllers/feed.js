const { validationResult } = require("express-validator");
const PostSchema = require("../models/Post");

exports.getpPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        _id: "1",
        title: "First Post",
        contents: "This is First Post",
        imageUrl: "images/nodejslogo.png",
        creator: {
          name: "Anirban",
        },
        createdAt: new Date(),
      },
    ],
  });
};
exports.createPosts = (req, res, next) => {
  const { content, title } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Validation Failed Backend",
      errors: errors.array(),
    });
  }
  const post = new PostSchema({
    title: title,
    content: content,
    imageUrl: "images/nodejslogo.png",
    creator: { name: "Anirban" },
  });
  post
    .save()
    .then((result) => {
      res.status(200).json({
        message: "Created Successfully",
        post: result,
      });
    })
    .catch((err) => console.error(err));
};
exports.getPost = (req, res, next) => {
  console.log("came Here");
};
