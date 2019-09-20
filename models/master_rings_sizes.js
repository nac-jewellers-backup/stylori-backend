'use strict';
module.exports = (sequelize, DataTypes) => {
  const master_rings_sizes = sequelize.define('master_rings_sizes', {
    name: DataTypes.STRING,
    alias: DataTypes.STRING,
    size: DataTypes.INTEGER
  }, {});
  master_rings_sizes.associate = function(models) {
    // associations can be defined here
  };
  return master_rings_sizes;
};