'use strict';
module.exports = (sequelize, DataTypes) => {
  const master_occasions = sequelize.define('master_occasions', {
    name: DataTypes.STRING,
    alias: DataTypes.STRING,
  }, {});
  master_occasions.associate = function(models) {
    // associations can be defined here
  };
  return master_occasions;
};