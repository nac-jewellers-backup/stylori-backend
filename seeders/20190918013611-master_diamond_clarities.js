'use strict';
const uuidv1 = require('uuid/v1');
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('master_diamond_clarities', [{
      id: uuidv1(),
      name: 'SI',
      alias: 'SI',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv1(),
      name: 'VS',
      alias: 'VS',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv1(),
      name: 'VVS',
      alias: 'VVS',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('master_diamond_clarities', null, {});

  }
};
