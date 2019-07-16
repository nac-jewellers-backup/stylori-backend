'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

      return queryInterface.bulkInsert('Roles', [
      {
        id:1,
        name: 'Admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id:2,
        name: 'Marketing Executive',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id:3,
        name: 'Sales Manager',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id:4,
        name: 'Sales Person',
        createdAt: new Date(),
        updatedAt: new Date()
      }
      ], {});

  },

  down: (queryInterface, Sequelize) => {
          return queryInterface.bulkDelete('Roles', null, {});

  }
};
