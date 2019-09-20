'use strict';
const uuidv1 = require('uuid/v1');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('master_metals_purities', [{
      id: uuidv1(),
      name: '18K',
      alias: '18K',
      short_code: 18,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('master_metals_purities', null, {});

  }
};
