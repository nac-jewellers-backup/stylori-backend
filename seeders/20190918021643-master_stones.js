'use strict';
const uuidv1 = require('uuid/v1');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('master_stones', [{
      id: uuidv1(),
      name: 'Single Stone',
      alias: 'Single Stone',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv1(),
      name: 'Two Stone',
      alias: 'Two Stone',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv1(),
      name: 'Three Stone',
      alias: 'Three Stone',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv1(),
      name: 'Five Stone',
      alias: 'Five Stone',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv1(),
      name: 'Seven Stone',
      alias: 'Seven Stone',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv1(),
      name: 'Nine Stone',
      alias: 'Nine Stone',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id: uuidv1(),
      name: 'Multistone',
      alias: 'Multistone',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('master_stones', null, {});

  }
};