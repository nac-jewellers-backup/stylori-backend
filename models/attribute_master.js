'use strict';
module.exports = (sequelize, DataTypes) => {
  const Attribute_master = sequelize.define('Attribute_master', {
    name: DataTypes.STRING,
    short_code: DataTypes.STRING,
    is_filter: DataTypes.BOOLEAN,
    filter_position: DataTypes.INTEGER,
    is_active: DataTypes.BOOLEAN
  }, {});
  Attribute_master.associate = function(models) {
    // associations can be defined here
  };
  return Attribute_master;
};