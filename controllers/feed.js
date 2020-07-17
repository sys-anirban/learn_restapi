const fs = require("fs");
const path = require("path");
const { validationResult } = require("express-validator");
const PostSchema = require("../models/Post");

// exports.getpPosts = (req, res, next) => {
//   PostSchema.find()
//     .then((posts) => {
//       return res.status(200).json({ message: "Get all posts", posts });
//     })
//     .catch((error) => {
//       res.status(404).json({ message: "Could not fetch posts" });
//     });
// };

exports.getpPosts = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;
  let totalItems;
  PostSchema.find()
    .countDocuments()
    .then((count) => {
      totalItems = count;
      return PostSchema.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then((posts) => {
      res
        .status(200)
        .json({ message: "Post Fetch Successfully", posts, totalItems });
    })
    .catch((err) => {
      return res.status(500).json({ message: "Fetch Failed" });
    });
};

exports.createPosts = (req, res, next) => {
  const { content, title } = req.body;
  const errors = validationResult(req);
  console.log("feedErrors", errors);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Validation Failed Backend",
      errors: errors.array(),
    });
  }

  if (!req.file) {
    return res.status(422).json({ message: "No File Selected" });
  }
  const imageUrl = req.file.path.replace(/\\/g, "/");
  const post = new PostSchema({
    title: title,
    content: content,
    imageUrl: imageUrl,
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
      res.status(200).json({ message: "Fetched single post", post });
    })
    .catch((error) => {
      return res.status(422).json({ message: "Could not find single Post" });
    });
};

exports.updatePost = (req, res, next) => {
  const postId = req.params.postId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Validation Failed Backend",
      errors: errors.array(),
    });
  }

  const { title, content } = req.body;
  let imageUrl = req.body.image;
  if (req.file) {
    imageUrl = req.file.path.replace(/\\/g, "/");
  }
  if (!imageUrl) {
    return res.status(422).json({ message: "No file picked" });
  }

  PostSchema.findById(postId)
    .then((post) => {
      if (!post) {
        return res
          .status(404)
          .json({ message: "Could not fine any post to edit" });
      }
      if (post.imageUrl !== imageUrl) {
        clearImage(post.imageUrl);
      }
      post.title = title;
      post.content = content;
      post.imageUrl = imageUrl;
      return post.save();
    })
    .then((result) => {
      return res.status(200).json({ message: "Post updated", post: result });
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ message: "Internal server error", err: err });
    });
};

exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;
  PostSchema.findById(postId).then((post) => {
    if (!post) {
      return res.status(500).json({ message: "Could not find post" });
    }
    //Check User
    clearImage(post.imageUrl);
    return PostSchema.findByIdAndRemove(postId).then((result) => {
      return res.status(200).json({ message: "Post Deleted" });
    });
  });
};

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => console.log(err));
};
