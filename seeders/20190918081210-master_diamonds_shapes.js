'use strict';
const uuidv1 = require('uuid/v1');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('master_diamonds_shapes', [{
      id: uuidv1(),
      name: 'Marquise',
      alias: 'Marquise',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv1(),
      name: 'Cushion',
      alias: 'Cushion',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id: uuidv1(),
      name: 'Round Trillion',
      alias: 'Round Trillion',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv1(),
      name: 'Pear',
      alias: 'Pear',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv1(),
      name: 'Oval',
      alias: 'Oval',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv1(),
      name: 'Heart',
      alias: 'Heart',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv1(),
      name: 'Round',
      alias: 'Round',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv1(),
      name: 'Rect.Cushion',
      alias: 'Rect.Cushion',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv1(),
      name: 'Assorted',
      alias: 'Assorted',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv1(),
      name: 'Radiant',
      alias: 'Radiant',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv1(),
      name: 'Trillion',
      alias: 'Trillion',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv1(),
      name: 'Triangle',
      alias: 'Triangle',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv1(),
      name: 'Emerald Cut',
      alias: 'Emerald Cut',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv1(),
      name: 'Square',
      alias: 'Square',
      createdAt: new Date(),
      updatedAt: new Date()
    },
  {
    id: uuidv1(),
    name: 'Princess',
    alias: 'Princess',
    createdAt: new Date(),
    updatedAt: new Date()
  }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('master_diamonds_shapes', null, {});

  }
};
