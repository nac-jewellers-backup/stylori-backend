'use strict';
module.exports = (sequelize, DataTypes) => {
  const master_countries = sequelize.define('master_countries', {
    iso: DataTypes.STRING,
    name: DataTypes.STRING,
    nicename: DataTypes.STRING,
    iso3: DataTypes.STRING,
    numcode: DataTypes.STRING,
    phonecode: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN
  }, {});
  master_countries.associate = function(models) {
    // associations can be defined here
  };
  return master_countries;
};