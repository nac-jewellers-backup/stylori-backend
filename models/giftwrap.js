'use strict';
module.exports = (sequelize, DataTypes) => {
  const giftwrap = sequelize.define('giftwrap', {
    cart_id: DataTypes.UUID,
    gift_from: DataTypes.STRING,
    gift_to: DataTypes.STRING,
    message: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN
  }, {});
  giftwrap.associate = function(models) {
    // associations can be defined here
  };
  return giftwrap;
};