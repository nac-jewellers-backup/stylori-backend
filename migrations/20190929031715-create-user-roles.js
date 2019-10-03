'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('user_roles', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      role_name: {
        type: Sequelize.STRING
        
      },
      user_id: {
        type: Sequelize.UUID,
        references: {
          model: { schema: 'auth', tableName: 'users' }, // name of Source model
          key: 'id',
        }
      },
      role_id: {
        type: Sequelize.UUID,
        references: {
          model:  { schema: 'auth', tableName: 'master_roles' }, // name of Source model
          key: 'id',
        }
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
    return queryInterface.dropTable('user_roles');
  }
};