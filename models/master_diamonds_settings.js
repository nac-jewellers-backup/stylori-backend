'use strict';
module.exports = (sequelize, DataTypes) => {
  const master_diamonds_settings = sequelize.define('master_diamonds_settings', {
    name: DataTypes.STRING,
    alias: DataTypes.STRING
  }, {});
  master_diamonds_settings.associate = function(models) {
    // associations can be defined here
  };
  return master_diamonds_settings;
};