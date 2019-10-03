'use strict';
module.exports = (sequelize, DataTypes) => {
  const discount_product_type_mapping = sequelize.define('discount_product_type_mapping', {
    discount_id: DataTypes.UUID,
    product_type: DataTypes.STRING
  }, {});
  discount_product_type_mapping.associate = function(models) {
    // associations can be defined here
  };
  return discount_product_type_mapping;
};