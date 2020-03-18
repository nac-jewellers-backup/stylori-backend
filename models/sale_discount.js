'use strict';
module.exports = (sequelize, DataTypes) => {
  const sale_discount = sequelize.define('sale_discount', {
    sale_id: DataTypes.UUID,
    components: {
      type: DataTypes.ARRAY(DataTypes.TEXT)
    },
    product_ids: {
      type: DataTypes.ARRAY(DataTypes.TEXT)
    },
    attributes: {
      type: DataTypes.ARRAY(DataTypes.TEXT)
    }
  }, {});
  sale_discount.associate = function(models) {
    // associations can be defined here
  };
  return sale_discount;
};