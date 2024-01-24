const jwt = require("jsonwebtoken");
const { getRepository } = require("typeorm");
const User = require("../models/user.model.js");

const authMiddleware = async (req, res, next) => {
  console.log("auth middleware ");
  const token = req.headers.token;

  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userRepository = getRepository(User);

    const user = await userRepository.findOne({
      where: { id: decoded.userId },
    });

    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    req.authenticatedUser = user;

    next();
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

module.exports = authMiddleware;
