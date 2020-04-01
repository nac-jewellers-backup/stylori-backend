'use strict';
module.exports = (sequelize, DataTypes) => {
  const master_diamonds_shapes = sequelize.define('master_diamonds_shapes', {
    name: DataTypes.STRING,
    alias: DataTypes.STRING,
    is_filter: DataTypes.BOOLEAN,
    is_active : DataTypes.BOOLEAN,
    filter_order : DataTypes.INTEGER
  }, {});
  master_diamonds_shapes.associate = function(models) {
    // associations can be defined here
  };
  return master_diamonds_shapes;
};