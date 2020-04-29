'use strict';
module.exports = (sequelize, DataTypes) => {
  const product_themes = sequelize.define('product_themes', {
    theme_name: DataTypes.STRING,
    product_id: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN
  }, {});
  product_themes.associate = function(models) {
    // associations can be defined here
    models.product_themes.belongsTo(models.master_themes,{
      foreignKey: 'theme_name',
      targetKey: 'name'
    });
  };
  return product_themes;
};