'use strict';
const uuidv1 = require('uuid/v1');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('master_metals_colors', [{
      id: uuidv1(),
      name: 'Only Metal',
      alias: 'Only Metal',
      short_code: '0',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv1(),
      name: 'Yellow',
      alias: 'Yellow',
      short_code: '1',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv1(),
      name: 'White',
      alias: 'White',
      short_code: '2',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv1(),
      name: 'Rose',
      alias: 'Rose',
      short_code: '3',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv1(),
      name: 'Yellow And White',
      alias: 'Yellow And White',
      short_code: '4',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv1(),
      name: 'Rose And White',
      alias: 'Rose And White',
      short_code: '5',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv1(),
      name: 'Three Tone',
      alias: 'Three Tone',
      short_code: '6',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('master_metals_colors', null, {});

  }
};
