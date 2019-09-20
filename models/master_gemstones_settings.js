'use strict';
module.exports = (sequelize, DataTypes) => {
  const master_gemstones_settings = sequelize.define('master_gemstones_settings', {
    name: DataTypes.STRING,
    alias: DataTypes.STRING
  }, {});
  master_gemstones_settings.associate = function(models) {
    // associations can be defined here
  };
  return master_gemstones_settings;
};