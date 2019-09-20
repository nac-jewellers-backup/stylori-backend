'use strict';
module.exports = (sequelize, DataTypes) => {
  const product_materials = sequelize.define('product_materials', {
    material_name: DataTypes.STRING,
    product_sku: DataTypes.STRING
  }, {
    timestamps: false
  });
  product_materials.associate = function(models) {
    // associations can be defined here
   
  models.product_materials.belongsTo(models.product_lists,{
    foreignKey: 'product_sku',
    targetKey: 'product_id'
  });
  
  };
  return product_materials;
};