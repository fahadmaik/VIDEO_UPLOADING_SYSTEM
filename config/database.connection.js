const user = require("../models/user.model.js");
const post = require("../models/post.js");
const dataSourceOptions = {
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "",
  database: "backend",
  synchronize: true,
  logging: true,
  entities: [user, post],
};

module.exports = dataSourceOptions;
