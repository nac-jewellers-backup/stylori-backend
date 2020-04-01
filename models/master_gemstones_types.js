'use strict';
module.exports = (sequelize, DataTypes) => {
  const master_gemstones_types = sequelize.define('master_gemstones_types', {
    name: DataTypes.STRING,
    alias: DataTypes.STRING,
    short_code: DataTypes.STRING,
    color_code: DataTypes.STRING,
    is_filter: DataTypes.BOOLEAN,
    is_active : DataTypes.BOOLEAN,
    filter_order : DataTypes.INTEGER
  }, {});
  master_gemstones_types.associate = function(models) {
    // associations can be defined here
  };
  return master_gemstones_types;
};