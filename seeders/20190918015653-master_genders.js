'use strict';
const uuidv1 = require('uuid/v1');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('master_genders', [{
      id: uuidv1(),
      name: 'Male',
      alias: 'Male',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv1(),
      name: 'Female',
      alias: 'Female',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id: uuidv1(),
      name: 'Unisex',
      alias: 'Unisex',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('master_genders', null, {});
  }
};
