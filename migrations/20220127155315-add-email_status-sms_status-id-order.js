"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("orders", "email_message_id", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn("orders", "sms_delivered_id", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("orders", "email_message_id"),
      queryInterface.removeColumn("orders", "sms_delivered_id"),
    ]);
  },
};
