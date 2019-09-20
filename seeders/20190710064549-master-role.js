'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

      return queryInterface.bulkInsert('roles', [
      {
        id:1,
        name: 'Admin',
        isactive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id:2,
        name: 'Marketing Executive',
        isactive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id:3,
        name: 'Sales Manager',
        isactive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id:4,
        name: 'Sales Person',
        isactive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      ], {});

  },

  down: (queryInterface, Sequelize) => {
          return queryInterface.bulkDelete('roles', null, {});

  }
};
