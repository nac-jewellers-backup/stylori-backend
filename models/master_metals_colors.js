'use strict';
module.exports = (sequelize, DataTypes) => {
  const master_metals_colors = sequelize.define('master_metals_colors', {
    name: DataTypes.STRING,
    alias: DataTypes.STRING,
    short_code: DataTypes.STRING,
    is_filter: DataTypes.BOOLEAN,
    is_active: DataTypes.BOOLEAN,
    filter_order : DataTypes.INTEGER
  }, {});
  master_metals_colors.associate = function(models) {
    // associations can be defined here
  };
  return master_metals_colors;
};