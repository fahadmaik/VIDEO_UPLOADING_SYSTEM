const { getRepository } = require("typeorm");
const Post = require("../models/post.model.js");

let postRepository;

const initializePostRepository = async () => {
  try {
    await require("../config/database.connection"); 
    postRepository = getRepository(Post);
  } catch (error) {
    console.error("Error initializing post repository:", error);
  }
};

const getPostRepository = () => {
  if (!postRepository) {
    throw new Error("Post repository not initialized");
  }
  return postRepository;
};

module.exports = { initializePostRepository, getPostRepository };
