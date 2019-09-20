'use strict';
module.exports = (sequelize, DataTypes) => {
  const trans_sku_descriptions = sequelize.define('trans_sku_descriptions', {
    sku_id: DataTypes.STRING,
    vendor_code: DataTypes.STRING,
    sku_description: DataTypes.STRING,
    vendor_lead_time: DataTypes.INTEGER,

  }, {
    timestamps: false,
    freezeTableName: true
  });
  trans_sku_descriptions.associate = function(models) {
    // associations can be defined here
  };
   
  return trans_sku_descriptions;
};