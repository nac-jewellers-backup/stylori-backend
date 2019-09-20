'use strict';
const uuidv1 = require('uuid/v1');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('master_product_categories', [{
      id: uuidv1(),
      name: 'Gold Jewellery',
      alias: 'Gold Jewellery',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv1(),
      name: 'Platinum Jewellery',
      alias: 'Platinum Jewellery',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv1(),
      name: 'Silver Jewellery',
      alias: 'Silver Jewellery',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv1(),
      name: 'Gold Coins',
      alias: 'Gold Coins',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('master_product_categories', null, {});

  }
};