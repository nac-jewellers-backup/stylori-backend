'use strict';
const uuidv1 = require('uuid/v1');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('master_materials', [{
      id: uuidv1(),
      name: 'Diamond',
      alias: 'Diamond',
      short_code: 'D',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv1(),
      name: 'Gold',
      alias: 'Gold',
      short_code: 'G',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv1(),
      name: 'Silver',
      alias: 'Silver',
      short_code: 'S',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv1(),
      name: 'Solitaire',
      alias: 'Solitaire',
      short_code: 'SO',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv1(),
      name: 'Platinum',
      alias: 'Platinum',
      short_code: 'P',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv1(),
      name: 'Gemstone',
      alias: 'Gemstone',
      short_code: 'GS',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('master_materials', null, {});

  }
};
