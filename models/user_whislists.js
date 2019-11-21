'use strict';
module.exports = (sequelize, DataTypes) => {
  const user_whislists = sequelize.define('user_whislists', {
    userprofile_id: DataTypes.UUID,
    product_id: DataTypes.STRING,
    sku_id: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN
  }, {});
  user_whislists.associate = function(models) {
    // associations can be defined here
  };
  return user_whislists;
};