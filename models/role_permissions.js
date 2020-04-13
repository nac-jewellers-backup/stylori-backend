'use strict';
module.exports = (sequelize, DataTypes) => {
  const role_permissions = sequelize.define('role_permissions', {
    role_id: DataTypes.UUID,
    page_id: DataTypes.INTEGER,
    is_view: DataTypes.BOOLEAN,
    is_read: DataTypes.BOOLEAN
  }, {});
  role_permissions.associate = function(models) {
    // associations can be defined here
  };
  return role_permissions;
};