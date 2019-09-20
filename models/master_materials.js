'use strict';
module.exports = (sequelize, DataTypes) => {
  const master_materials = sequelize.define('master_materials', {
    name: DataTypes.STRING,
    alias: DataTypes.STRING,
    short_code: DataTypes.STRING
  }, {});
  master_materials.associate = function(models) {
    // associations can be defined here
  };
  return master_materials;
};