'use strict';
const uuidv1 = require('uuid/v1');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('master_gemstones_types', [{
      id: uuidv1(),
      name: 'Navrathna',
      alias: 'Navrathna',
      short_code: '1',
      color_code: 31,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('master_gemstones_types', null, {});

  }
};
