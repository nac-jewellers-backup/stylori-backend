'use strict';
module.exports = (sequelize, DataTypes) => {
  const role_permissions = sequelize.define('role_permissions', {
    role_id: DataTypes.UUID,
    page_id: DataTypes.INTEGER,
    is_view: DataTypes.BOOLEAN,
    is_write: DataTypes.BOOLEAN
  }, {});
  role_permissions.associate = function(models) {
    // associations can be defined here
    models.role_permissions.belongsTo(models.uniquepages,{
      foreignKey: 'page_id',
      targetKey: 'id'
  })
  };
  return role_permissions;
};