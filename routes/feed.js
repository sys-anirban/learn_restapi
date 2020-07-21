const express = require("express");
const router = express.Router();
const feedController = require("../controllers/feed");
const { body } = require("express-validator");
const isAuth = require("../is-auth");

router.get("/posts", isAuth, feedController.getpPosts);
router.post(
  "/post",
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  feedController.createPosts
);
router.get("/post/:postId", feedController.getPost);
router.put(
  "/post/:postId",
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  feedController.updatePost
);

router.delete("/post/:postId", feedController.deletePost);

module.exports = router;
