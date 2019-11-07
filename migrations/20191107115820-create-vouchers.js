'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('vouchers', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      code: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      uses: {
        type: Sequelize.INTEGER
      },
      max_uses: {
        type: Sequelize.INTEGER
      },
      max_uses_user: {
        type: Sequelize.INTEGER
      },
      type: {
        type: Sequelize.INTEGER
      },
      discount_amount: {
        type: Sequelize.DOUBLE
      },
      is_fixed: {
        type: Sequelize.BOOLEAN
      },
      starts_at: {
        type: Sequelize.DATE
      },
      expires_at: {
        type: Sequelize.DATE
      },
      is_active: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('vouchers');
  }
};