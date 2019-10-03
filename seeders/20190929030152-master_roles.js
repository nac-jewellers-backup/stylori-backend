'use strict';
const uuidv1 = require('uuid/v1');

module.exports = {
  up: (queryInterface, Sequelize) => {

      return queryInterface.bulkInsert('master_roles', [
      {
        id:uuidv1(),
        role_name: 'Admin',
        isactive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      
      {
        id:uuidv1(),
        role_name: 'User',
        isactive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      ], {
        schema: 'auth'
      });

  },

  down: (queryInterface, Sequelize) => {
          return queryInterface.bulkDelete('master_roles', null, {});

  }
};

