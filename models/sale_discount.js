'use strict';
module.exports = (sequelize, DataTypes) => {
  const sale_discount = sequelize.define('sale_discount', {
    components: {
      type: DataTypes.ARRAY(DataTypes.TEXT)
    },
    product_ids: {
      type: DataTypes.ARRAY(DataTypes.TEXT)
    },
    attributes: {
      type: DataTypes.ARRAY(DataTypes.TEXT)
    },

    discount_type:{
      type: DataTypes.INTEGER
    },
    discount_value: {
      type: DataTypes.DOUBLE
    },
    product_attributes: DataTypes.JSON,
    product_attributes_text : DataTypes.TEXT,
    discount_name : DataTypes.TEXT,
    discount_title : DataTypes.TEXT,
    is_active : DataTypes.BOOLEAN
  }, {});
  sale_discount.associate = function(models) {
    // associations can be defined here
  };
  return sale_discount;
};