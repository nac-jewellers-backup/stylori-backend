'use strict';
module.exports = (sequelize, DataTypes) => {
  const master_roles = sequelize.define('master_roles', {
    role_name: DataTypes.STRING,
    isactive: DataTypes.BOOLEAN
  }, {
    schema: 'auth'
  });
  master_roles.associate = function(models) {
    // associations can be defined here
    models.master_roles.hasMany(models.user_roles,{
      foreignKey: 'id',
      targetKey: 'role_id'
    });
  };
  return master_roles;
};