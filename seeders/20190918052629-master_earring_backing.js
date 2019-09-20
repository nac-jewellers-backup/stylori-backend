'use strict';
const uuidv1 = require('uuid/v1');

module.exports = {
  up: (queryInterface, Sequelize) => {
   
      return queryInterface.bulkInsert('master_earring_backings', [{
        id:uuidv1(),
        name: 'Screw',
        alias: 'Screw',
        createdAt: new Date(),
      updatedAt: new Date()
      }], {});
  
  },

  down: (queryInterface, Sequelize) => {
    
      return queryInterface.bulkDelete('master_earring_backings', null, {});
  }
};
