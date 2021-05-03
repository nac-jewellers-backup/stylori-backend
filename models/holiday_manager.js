"use strict";
module.exports = (sequelize, DataTypes) => {
  const holiday_manager = sequelize.define(
    "holiday_manager",
    {
      holiday_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        unique: true,
      },
    },
    {}
  );
  holiday_manager.associate = function (models) {
    // associations can be defined here
  };
  return holiday_manager;
};
