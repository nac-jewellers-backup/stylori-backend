'use strict';
module.exports = (sequelize, DataTypes) => {
  const master_weights = sequelize.define('master_weights', {
    name: DataTypes.STRING,
    alias: DataTypes.STRING
  }, {});
  master_weights.associate = function(models) {
    // associations can be defined here
  };
  return master_weights;
};