'use strict';
module.exports = (sequelize, DataTypes) => {
  const vouchers = sequelize.define('vouchers', {
    code: DataTypes.STRING,
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    uses: DataTypes.INTEGER,
    min_cart_value: DataTypes.DOUBLE,
    max_uses: DataTypes.INTEGER,
    max_uses_user: DataTypes.INTEGER,
    type: DataTypes.INTEGER,
    discount_amount: DataTypes.DOUBLE,
    is_fixed: DataTypes.BOOLEAN,
    attributes: DataTypes.ARRAY(DataTypes.INTEGER),
    starts_at: DataTypes.DATE,
    expires_at: DataTypes.DATE,
    is_active: DataTypes.BOOLEAN
  }, {});
  vouchers.associate = function(models) {
    // associations can be defined here
  };
  return vouchers;
};