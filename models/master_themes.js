'use strict';
module.exports = (sequelize, DataTypes) => {
  const master_themes = sequelize.define('master_themes', {
    name: DataTypes.STRING,
    alias: DataTypes.STRING
  }, {});
  master_themes.associate = function(models) {
    // associations can be defined here
  };
  return master_themes;
};