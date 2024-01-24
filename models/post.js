const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Post",
  tableName: "posts",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    title: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    body: {
      type: "text",
      nullable: false,
    },

    filePath: {
      type: "varchar",
      nullable: false,
    },
    createdAt: {
      type: "datetime",
      default: () => "CURRENT_TIMESTAMP",
    },
    updatedAt: {
      type: "datetime",
      default: () => "CURRENT_TIMESTAMP",
    },
  },
  relations: {
    user: {
      target: "User",
      type: "many-to-one",
      joinColumn: true,
      inverseSide: "posts",
    },
  },
});
