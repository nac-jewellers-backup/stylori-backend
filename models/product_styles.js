'use strict';
module.exports = (sequelize, DataTypes) => {
  const product_styles = sequelize.define('product_styles', {
    style_name: DataTypes.STRING,
    product_id: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN
  }, {});
  product_styles.associate = function(models) {
    // associations can be defined here
    models.product_styles.belongsTo(models.master_styles,{
      foreignKey: 'style_name',
      targetKey: 'name'
    });
  };
  return product_styles;
};