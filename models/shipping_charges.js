'use strict';
module.exports = (sequelize, DataTypes) => {
  const shipping_charges = sequelize.define('shipping_charges', {
    zone_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    charge_type: DataTypes.INTEGER,
    range_from: DataTypes.DOUBLE,
    range_to: DataTypes.DOUBLE,
    shipment_charge: DataTypes.DOUBLE,
    product_attributes: {
      type: DataTypes.ARRAY(DataTypes.TEXT),

    },
    display_attributes: DataTypes.TEXT,
    is_active: DataTypes.BOOLEAN
  }, {});
  shipping_charges.associate = function(models) {
    // associations can be defined here
  };
  return shipping_charges;
};