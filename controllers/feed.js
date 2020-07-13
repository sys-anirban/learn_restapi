const { validationResult } = require("express-validator");
const PostSchema = require("../models/Post");

exports.getpPosts = (req, res, next) => {
  PostSchema.find()
    .then((posts) => {
      return res.status(200).json({ message: "Get all posts", posts });
    })
    .catch((error) => {
      res.status(404).json({ message: "Could not fetch posts" });
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
  const { postId } = req.params;
  PostSchema.findById(postId)
    .then((post) => {
      return res.status(200).json({ message: "Fetched single post", post });
    })
    .catch((error) => {
      return res.status(422).json({ message: "Could not find single Post" });
    });
};
