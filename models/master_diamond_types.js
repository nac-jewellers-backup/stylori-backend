'use strict';
module.exports = (sequelize, DataTypes) => {
  const master_diamond_types = sequelize.define('master_diamond_types', {
    diamond_color: DataTypes.STRING,
    diamond_clarity: DataTypes.STRING,
    short_code: DataTypes.STRING
  }, {});
  master_diamond_types.associate = function(models) {
    // associations can be defined here
  };
  return master_diamond_types;
};