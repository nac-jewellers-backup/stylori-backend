'use strict';
module.exports = (sequelize, DataTypes) => {
  const master_genders = sequelize.define('master_genders', {
    name: DataTypes.STRING,
    alias: DataTypes.STRING
  }, {});
  master_genders.associate = function(models) {
    // associations can be defined here
  };
  return master_genders;
};