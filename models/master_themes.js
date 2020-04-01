'use strict';
module.exports = (sequelize, DataTypes) => {
  const master_themes = sequelize.define('master_themes', {
    name: DataTypes.STRING,
    alias: DataTypes.STRING,
    is_filter: DataTypes.BOOLEAN,
    is_active : DataTypes.BOOLEAN,
    filter_order : DataTypes.INTEGER
  }, {});
  master_themes.associate = function(models) {
    // associations can be defined here
  };
  return master_themes;
};