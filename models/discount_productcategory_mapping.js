'use strict';
module.exports = (sequelize, DataTypes) => {
  const discount_productcategory_mapping = sequelize.define('discount_productcategory_mapping', {
    discount_id: DataTypes.UUID,
    product_category: DataTypes.STRING
  }, {});
  discount_productcategory_mapping.associate = function(models) {
    // associations can be defined here
  };
  return discount_productcategory_mapping;
};