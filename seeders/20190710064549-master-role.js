'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

      return queryInterface.bulkInsert('Roles', [
      {
        id:1,
        name: 'Super Admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id:2,
        name: 'Business Development Executive - BDE',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id:3,
        name: 'Team Lead - TL',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id:4,
        name: 'Photographer',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id:5,
        name: 'Photoshop Team',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id:6,
        name: 'Quality Check',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id:7,
        name: 'Finance',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id:8,
        name: 'Management (Owner)',
        createdAt: new Date(),
        updatedAt: new Date()
      }
      ], {});

  },

  down: (queryInterface, Sequelize) => {
          return queryInterface.bulkDelete('Roles', null, {});

  }
};
