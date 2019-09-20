'use strict';
const uuidv1 = require('uuid/v1');
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('master_designs', [
      {
        id: uuidv1(),
        name: 'Ganesha',
        alias: 'Ganesha',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv1(),
        name: 'Balaji',
        alias: 'Balaji',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv1(),
        name: 'Jesus',
        alias: 'Jesus',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv1(),
        name: 'Lakshmi',
        alias: 'Lakshmi',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv1(),
        name: 'Plain',
        alias: 'Plain',
        createdAt: new Date(),
        updatedAt: new Date()
      }],{})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('master_designs', null, {});

  }
};
