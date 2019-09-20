'use strict';
const uuidv1 = require('uuid/v1');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('master_bangels_bracelets_sizes', [
      {
        id: uuidv1(),
        name: '2.4',
        alias: '2.4',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv1(),
        name: '2.6',
        alias: '2.6',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv1(),
        name: '2.8',
        alias: '2.8',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv1(),
        name: 'Free size',
        alias: 'Free size',
        createdAt: new Date(),
        updatedAt: new Date()
      }],{})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('master_bangels_bracelets_sizes', null, {});

  }
};
