'use strict';
module.exports = (sequelize, DataTypes) => {
  const user_roles = sequelize.define('user_roles', {
    role_name: DataTypes.STRING,
    user_id: DataTypes.UUID,
    role_id: DataTypes.UUID
  }, {
    schema: 'auth'
  });
  user_roles.associate = function(models) {
    // associations can be defined here
    models.user_roles.belongsTo(models.users,{
      foreignKey: 'user_id',
      targetKey: 'id'
    });

    models.user_roles.belongsTo(models.master_roles,{
      foreignKey: 'role_id',
      targetKey: 'id'
    });

  };
  return user_roles;
};