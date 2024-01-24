const { getRepository } = require("typeorm");
const User = require("../models/user.model.js");

let userRepository;

const initializeUserRepository = async () => {
  try {
    await require("../config/database.connection"); // Ensure database connection is established
    userRepository = getRepository(User);
  } catch (error) {
    console.error("Error initializing user repository:", error);
  }
};

const getUserRepository = () => {
  if (!userRepository) {
    throw new Error("User repository not initialized");
  }
  return userRepository;
};

module.exports = { initializeUserRepository, getUserRepository };
