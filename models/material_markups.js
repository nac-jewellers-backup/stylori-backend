'use strict';
module.exports = (sequelize, DataTypes) => {
  const material_markups = sequelize.define('material_markups', {
    material_name: DataTypes.STRING,
    markup_type: DataTypes.INTEGER,
    price_min: DataTypes.DOUBLE,
    price_max: DataTypes.DOUBLE,
    markup_value: DataTypes.DOUBLE
  }, {});
  material_markups.associate = function(models) {
    // associations can be defined here
  };
  return material_markups;
};