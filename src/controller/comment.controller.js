const commentModel = require("../models/comment.model");
const postModel = require("../models/post.model");

async function addCommentController(req, res) {
  try {
    const userId = req.user.id;
    const postId = req.params.postId;
    const { text } = req.body;

    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = await commentModel.create({
      user: userId,
      post: postId,
      text,
    });

    const populatedComment = await comment.populate("user", "username profile");

    res.status(201).json({
      message: "Comment added",
      comment: populatedComment,
    });

  } catch (err) {
    console.log("Comment Error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

async function getCommentsController(req, res) {
  try {
    const postId = req.params.postId;

    const comments = await commentModel
      .find({ post: postId })
      .populate("user", "username profile")
      .sort({ createdAt: -1 });

    res.status(200).json({ comments });

  } catch (err) {
    console.log("Get Comment Error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  addCommentController,
  getCommentsController,
};