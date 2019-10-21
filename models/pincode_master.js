'use strict';
module.exports = (sequelize, DataTypes) => {
  const pincode_master = sequelize.define('pincode_master', {
    picode: DataTypes.STRING,
    area: DataTypes.STRING,
    district: DataTypes.STRING,
    state: DataTypes.STRING,
    country: DataTypes.STRING,
    lat: DataTypes.DOUBLE,
    lng: DataTypes.DOUBLE,
    is_active: DataTypes.BOOLEAN
  }, {});
  pincode_master.associate = function(models) {
    // associations can be defined here
  };
  return pincode_master;
};