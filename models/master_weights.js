'use strict';
module.exports = (sequelize, DataTypes) => {
  const master_weights = sequelize.define('master_weights', {
    name: DataTypes.STRING,
    alias: DataTypes.STRING,
    is_filter: DataTypes.BOOLEAN,
    is_active : DataTypes.BOOLEAN,
    filter_order : DataTypes.INTEGER
  }, {});
  master_weights.associate = function(models) {
    // associations can be defined here
  };
  return master_weights;
};