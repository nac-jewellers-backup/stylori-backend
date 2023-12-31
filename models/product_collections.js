'use strict';
module.exports = (sequelize, DataTypes) => {
  const product_collections = sequelize.define('product_collections', {
    collection_name: DataTypes.STRING,
    product_id: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN
  }, {});
  product_collections.associate = function(models) {
    // associations can be defined here
    models.product_collections.belongsTo(models.master_collections,{
      foreignKey: 'collection_name',
      targetKey: 'name'
    });
  };
  return product_collections;
};