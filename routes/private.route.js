const Router = require("express");
const { getRepository } = require("typeorm");
const Post = require("../models/post.js");
const authMiddleware = require("../Auth/AuthMiddleware.js");
const upload = require("../multer/multerMiddleware.js");
const adminRouter = Router();
adminRouter.use(authMiddleware);
adminRouter.post("/createpost", upload.single("filepath"), async (req, res) => {
  try {
    const { title, body } = req.body;
    if (!title || !body || !req.file) {
      res
        .status(400)
        .json({ message: "Title, body, and file are mandatory fields!" });
      return;
    }

    const { id: userId } = req.authenticatedUser;
    const postRepository = getRepository(Post);
    let FileUrl =
      req.protocol +
      "://" +
      req.hostname +
      ":3000" +
      "/videos" +
      "/" +
      req.file.filename;
    const Newposts = await postRepository.create({
      title,
      body,
      user: userId,
      filePath: FileUrl,
    });
    await postRepository.save(Newposts);
    res.status(201).json({ Newposts });
  } catch (err) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
adminRouter.put("/updatepost/:postId", async (req, res) => {
  try {
    const { title, body } = req.body;
    const postId = req.params.postId;
    const { id: userId } = req.authenticatedUser;

    const postRepository = getRepository(Post);
    const existingPost = await postRepository.findOne({
      where: { id: postId },
      relations: ["user"],
    });

    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (existingPost.user && existingPost.user.id !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this post" });
    }

    existingPost.title = title;
    existingPost.body = body;

    await postRepository.save(existingPost);

    res.json({ updatedPost: existingPost });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

adminRouter.delete("/deletepost/:postId", async (req, res) => {
  try {
    const postId = req.params.postId;
    const { id: userId } = req.authenticatedUser;

    const postRepository = getRepository(Post);
    const deletedPost = await postRepository.findOne({
      where: { id: postId },
      relations: ["user"],
    });

    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (deletedPost.user && deletedPost.user.id !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this post" });
    }

    await postRepository.remove(deletedPost);

    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
module.exports = adminRouter;
