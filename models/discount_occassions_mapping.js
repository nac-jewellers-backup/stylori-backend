'use strict';
module.exports = (sequelize, DataTypes) => {
  const discount_occassions_mapping = sequelize.define('discount_occassions_mapping', {
    discount_id: DataTypes.UUID,
    occassions: DataTypes.STRING
  }, {});
  discount_occassions_mapping.associate = function(models) {
    // associations can be defined here
  };
  return discount_occassions_mapping;
};