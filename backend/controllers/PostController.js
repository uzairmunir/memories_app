const Post = require("../models/PostModel");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

//@method   GET
//@access   public
//@desc     get all posts
const getAllPosts = asyncHandler(async (req, res) => {
  const { page } = req.query;

  const LIMIT = 6;

  const Skip = (Number(page) - 1) * LIMIT;
  const total = await Post.countDocuments({});
  const posts = await Post.find().sort({ _id: -1 }).limit(LIMIT).skip(Skip);

  res.status(200).json({
    data: posts,
    currentPage: Number(page),
    numberOfPages: Math.ceil(total / LIMIT),
  });
});

//@method   POST
//@access   public
//@desc     Add new post
const createPost = asyncHandler(async (req, res) => {
  const post = req.body;
  const newPost = await Post.create({ ...post, creator: req.userId });
  res.status(200).json(newPost);
});

//@method   PUT
//@access   public
//@desc     Update Post
const updatePost = asyncHandler(async (req, res) => {
  let { id } = req.params;
  const post = await Post.findById(id);
  if (post) {
    const updatedPost = await Post.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updatedPost);
  } else {
    res
      .status(400)
      .json({ status: "failed", msg: "Post with this id not found." });
  }
});

//@method   DELETE
//@access   public
//@desc     Delete Post
const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post) {
    post.remove();
    res.status(200).json({ status: "success", msg: "Post deleted" });
  } else {
    res
      .status(400)
      .json({ status: "failed", msg: "Post with this id not found." });
  }
});

//@method  PUT
//@access  private
//@desc    Like Post
const likePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!req.userId) {
    res.status(400).json({ msg: "Unauthenticated" });
  }
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);
  const post = await Post.findById(id);

  if (post) {
    let index = post.likes.findIndex((id) => id === String(req.userId));
    if (index === -1) {
      post.likes.push(req.userId);
    } else {
      post.likes = post.likes.filter((id) => id !== String(req.userId));
    }
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes + 1 },
      { new: true }
    );
    res.json(updatedPost);
  }
});

//@method GET
//@access   public
//@desc    Get post by search
const getPostsBySearch = async (req, res) => {
  const { searchQuery } = req.query;
  const title = new RegExp(searchQuery, "i");
  const posts = await Post.find({ title });
  res.json(posts);
};

// @method GET
// @access public
//@desc    Get post details
const getPostDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  if (post) {
    res.json(post);
  } else {
    res.status(400).json({ msg: "Post not found" });
  }
});

module.exports = {
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
  likePost,
  getPostsBySearch,
  getPostDetails,
};
