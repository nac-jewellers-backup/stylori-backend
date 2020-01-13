'use strict';
module.exports = (sequelize, DataTypes) => {
  const product_by_design = sequelize.define('product_by_design', {
    design_name: DataTypes.STRING,
    product_id: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN
  }, {});
  product_by_design.associate = function(models) {
    // associations can be defined here
  };
  return product_by_design;
};