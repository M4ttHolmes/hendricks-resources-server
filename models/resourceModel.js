const { DataTypes } = require("sequelize");
const db = require("../db");

const Resource = db.define("resource", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    checkedOut: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    owner: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = Resource;