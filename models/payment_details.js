"use strict";
module.exports = (sequelize, DataTypes) => {
  const payment_details = sequelize.define(
    "payment_details",
    {
      order_id: DataTypes.UUID,
      payment_response: DataTypes.STRING,
    },
    {}
  );
  payment_details.associate = function (models) {
    // associations can be defined here
    models.payment_details.belongsTo(models.orders, {
      foreignKey: "order_id",
      targetKey: "id",
    });
  };
  return payment_details;
};
