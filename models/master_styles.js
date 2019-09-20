'use strict';
module.exports = (sequelize, DataTypes) => {
  const master_styles = sequelize.define('master_styles', {
    name: DataTypes.STRING,
    alias: DataTypes.STRING
  }, {});
  master_styles.associate = function(models) {
    // associations can be defined here
  };
  return master_styles;
};