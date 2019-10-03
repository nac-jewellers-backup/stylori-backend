'use strict';
const uuidv1 = require('uuid/v1');
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('master_roles', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: uuidv1(),
      },
      role_name: {
        type: Sequelize.STRING
      },
      isactive: {
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
    },{
      schema: 'auth'
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('master_roles');
  }
};