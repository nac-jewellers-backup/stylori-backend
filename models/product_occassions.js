'use strict';
module.exports = (sequelize, DataTypes) => {
  const product_occassions = sequelize.define('product_occassions', {
    occassion_name: DataTypes.STRING,
    product_id: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN
  }, {});
  product_occassions.associate = function(models) {
    // associations can be defined here
    models.product_occassions.belongsTo(models.master_occasions,{
      foreignKey: 'occassion_name',
      targetKey: 'name'
    });
  };
  return product_occassions;
};