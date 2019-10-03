'use strict';
module.exports = (sequelize, DataTypes) => {
  const discount_styles_mapping = sequelize.define('discount_styles_mapping', {
    discount_id: DataTypes.UUID,
    styles: DataTypes.STRING
  }, {});
  discount_styles_mapping.associate = function(models) {
    // associations can be defined here
  };
  return discount_styles_mapping;
};