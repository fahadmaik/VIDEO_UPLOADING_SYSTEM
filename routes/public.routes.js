const { hash, compare } = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getRepository } = require("typeorm");
const User = require("../models/user.model.js");
const Post = require("../models/post.js");
const Router = require("express");
const publicRoutes = Router();

publicRoutes.get("/posts", async (req, res) => {
  try {
    const postRepository = getRepository(Post);
    const posts = await postRepository.find();

    if (posts.length > 0) {
      res.json(posts);
    } else {
      res.json({ message: "No posts found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

publicRoutes.get("/posts/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    const postRepository = getRepository(Post);
    const post = await postRepository.findOne({ where: { id: postId } });

    if (post) {
      res.json(post);
    } else {
      res.json({ message: "No post with specified id was found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

publicRoutes.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const encryptedPassword = await hash(password, 10);
    const userRepository = getRepository(User);
    const user = userRepository.create({
      username,
      email,
      password: encryptedPassword,
    });

    await userRepository.save(user);

    res.status(201).json({ user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

publicRoutes.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({ where: { username } });

    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({ message: "Unauthorized, invalid credentials" });
      return;
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET
    );
    res.status(200).json({ token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = publicRoutes;
