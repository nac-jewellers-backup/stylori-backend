'use strict';
const uuidv1 = require('uuid/v1');

module.exports = {
  up: (queryInterface, Sequelize) => {

      return queryInterface.bulkInsert('master_diamond_types', [{
        id: uuidv1(),
        diamond_color: 'SI',
        diamond_clarity: 'IJ',
        short_code: 'SIIJ',
        createdAt: new Date(),
        updatedAt: new Date()
      }], {});
    
  },

  down: (queryInterface, Sequelize) => {
  
      return queryInterface.bulkDelete('master_diamond_types', null, {});
  }
};
