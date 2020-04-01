'use strict';
module.exports = (sequelize, DataTypes) => {
  const master_stones_shapes = sequelize.define('master_stones_shapes', {
    name: DataTypes.STRING,
    alias: DataTypes.STRING,
    is_filter: DataTypes.BOOLEAN,
    is_active : DataTypes.BOOLEAN,
    filter_order : DataTypes.INTEGER
  }, {});
  master_stones_shapes.associate = function(models) {
    // associations can be defined here
  };
  return master_stones_shapes;
};