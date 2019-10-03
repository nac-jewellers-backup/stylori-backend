'use strict';
module.exports = (sequelize, DataTypes) => {
  const discount_themes_mapping = sequelize.define('discount_themes_mapping', {
    discount_id: DataTypes.UUID,
    theme: DataTypes.STRING
  }, {});
  discount_themes_mapping.associate = function(models) {
    // associations can be defined here
  };
  return discount_themes_mapping;
};