const express = require("express");
const {
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
  likePost,
  getPostsBySearch,
  getPostDetails,
} = require("../controllers/PostController");
const router = express.Router();
const auth = require("../middleware/Auth");

// Get All Post
router.get("/", getAllPosts);
// Get Posts by Search
router.get("/search", getPostsBySearch);
// Get Post Details
router.get("/:id", getPostDetails);

// Create a new Post
router.post("/new", auth, createPost);

// Update a Post
router.put("/:id", auth, updatePost);

// delete a post
router.delete("/:id", auth, deletePost);

// Like Post
router.put("/:id/likePost", auth, likePost);

module.exports = router;
