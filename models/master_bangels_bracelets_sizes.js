'use strict';
const uuidv1 = require('uuid/v1');
module.exports = (sequelize, DataTypes) => {
  const master_bangels_bracelets_sizes = sequelize.define('master_bangels_bracelets_sizes', {
    id:
    { 
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: uuidv1()

    },
    name: DataTypes.STRING,
    alias: DataTypes.STRING
  }, {});
  master_bangels_bracelets_sizes.associate = function(models) {
    // associations can be defined here
  };
  return master_bangels_bracelets_sizes;
};