'use strict';
module.exports = (sequelize, DataTypes) => {
  const master_diamonds_colors = sequelize.define('master_diamonds_colors', {
    name: DataTypes.STRING,
    alias: DataTypes.STRING,
    short_code: DataTypes.STRING
  }, {});
  master_diamonds_colors.associate = function(models) {
    // associations can be defined here
  };
  return master_diamonds_colors;
};