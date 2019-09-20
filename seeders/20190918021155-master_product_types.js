'use strict';
const uuidv1 = require('uuid/v1');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('master_product_types', [{
      id: uuidv1(),
      name: 'Earrings',
      alias: 'Earrings',
      short_code: 'E',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv1(),
      name: 'Pendants',
      alias: 'Pendants',
      short_code: 'P',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv1(),
      name: 'Bracelets',
      alias: 'Bracelets',
      short_code: 'BR',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv1(),
      name: 'Nosepins',
      alias: 'Nosepins',
      short_code: 'N',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv1(),
      name: 'Bangles',
      alias: 'Bangles',
      short_code: 'BA',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv1(),
      name: 'Rings',
      alias: 'Rings',
      short_code: 'R',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv1(),
      name: 'Gold Coins',
      alias: 'Gold Coins',
      short_code: 'G',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('master_product_types', null, {});

  }
};