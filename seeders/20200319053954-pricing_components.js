'use strict';
const uuidv1 = require('uuid/v1');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('master_pricing_components', [{
      name: 'All',
      createdAt: new Date(),
      is_active: true,
      updatedAt: new Date()
    },
    {
      name: 'Gold',
      is_active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: 'Diamond',
      is_active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Making Charge',
      is_active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Silver',
      is_active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Gemstone',
      is_active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('master_pricing_components', null, {});
  }
};
