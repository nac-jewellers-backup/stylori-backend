'use strict';
const uuidv1 = require('uuid/v1');

module.exports = (sequelize, DataTypes) => {
  const master_vendors = sequelize.define('master_vendors', {
    id:
    { 
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: uuidv1(),
        primaryKey: true,
    },
    name: DataTypes.STRING,
    short_code: DataTypes.STRING,
    address: DataTypes.STRING,
    vendor_delivary_days: DataTypes.INTEGER,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    currency: DataTypes.STRING,
    pincode: DataTypes.STRING,
    gst_no: DataTypes.STRING
  }, {});
  master_vendors.associate = function(models) {
    // associations can be defined here
  };
  return master_vendors;
};