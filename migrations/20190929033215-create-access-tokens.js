'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('access_tokens', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      user_id: {
        type: Sequelize.UUID,
        references: {
          model: { schema: 'auth', tableName: 'users' }, // name of Source model
          key: 'id',
        }
      },
      access_token: {
        type: Sequelize.STRING
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
      schema:'auth'
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('access_tokens');
  }
};