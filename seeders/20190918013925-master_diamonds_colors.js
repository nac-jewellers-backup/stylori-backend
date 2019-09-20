'use strict';
const uuidv1 = require('uuid/v1');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('master_diamonds_colors', [{
      id: uuidv1(),
      name: 'EF',
      alias: 'EF',
      short_code: 'EF',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv1(),
      name: 'GH',
      alias: 'GH',
      short_code: 'GH',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv1(),
      name: 'IJ',
      alias: 'IJ',
      short_code: 'IJ',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    
      return queryInterface.bulkDelete('master_diamonds_colors', null, {});
  }
};
