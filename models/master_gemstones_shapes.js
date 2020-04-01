'use strict';
module.exports = (sequelize, DataTypes) => {
  const master_gemstones_shapes = sequelize.define('master_gemstones_shapes', {
    name: DataTypes.STRING,
    alias: DataTypes.STRING,
    is_filter: DataTypes.BOOLEAN,
    is_active : DataTypes.BOOLEAN,
    filter_order : DataTypes.INTEGER
  }, {});
  master_gemstones_shapes.associate = function(models) {
    // associations can be defined here
  };
  return master_gemstones_shapes;
};