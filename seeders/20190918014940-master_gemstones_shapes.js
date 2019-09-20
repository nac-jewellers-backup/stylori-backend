'use strict';
const uuidv1 = require('uuid/v1');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('master_gemstones_shapes', [{
      id: uuidv1(),
      name: 'Marquise',
      alias: 'Marquise',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('master_gemstones_shapes', null, {});

  }
};
