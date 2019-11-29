'use strict';
module.exports = (sequelize, DataTypes) => {
  const attribute_mapping = sequelize.define('attribute_mapping', {
    attribute_name: DataTypes.STRING,
    attribute_value: DataTypes.STRING
    }, {});
  attribute_mapping.associate = function(models) {
    // associations can be defined here
  };
  return attribute_mapping;
};