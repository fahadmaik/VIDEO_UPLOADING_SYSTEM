require("dotenv").config();

const user = require("../models/user.model.js");
const post = require("../models/post.js");

const dataSourceOptions = {
  type: process.env.DATABASE_TYPE,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: true,
  logging: true,
  entities: [user, post],
};

module.exports = dataSourceOptions;
