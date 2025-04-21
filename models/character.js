const sequelize = require("../includes/database");
const { Sequelize } = require("sequelize");

module.exports = sequelize.define("characters", {
  name: {
    type: Sequelize.STRING,
    unique: true,
  },
  class: {
    type: Sequelize.STRING,
  },
});
