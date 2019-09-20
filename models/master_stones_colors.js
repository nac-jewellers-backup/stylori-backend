'use strict';
module.exports = (sequelize, DataTypes) => {
  const master_stones_colors = sequelize.define('master_stones_colors', {
    name: DataTypes.STRING,
    alias: DataTypes.STRING
  }, {});
  master_stones_colors.associate = function(models) {
    // associations can be defined here
  };
  return master_stones_colors;
};