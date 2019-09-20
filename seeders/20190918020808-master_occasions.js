'use strict';
const uuidv1 = require('uuid/v1');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('master_occasions', [{
      id: uuidv1(),
      name: 'Workwear',
      alias: 'Workwear',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id: uuidv1(),
      name: 'Special Occasion',
      alias: 'Special Occasion',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id: uuidv1(),
      name: 'Valentine\'s Day',
      alias: 'Valentine\'s Day',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id: uuidv1(),
      name: 'Akshaya Tritiya',
      alias: 'Akshaya Tritiya',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id: uuidv1(),
      name: 'Anniversary',
      alias: 'Anniversary',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id: uuidv1(),
      name: 'Engagement',
      alias: 'Engagement',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id: uuidv1(),
      name: 'Evening',
      alias: 'Evening',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id: uuidv1(),
      name: 'Wedding',
      alias: 'Wedding',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id: uuidv1(),
      name: 'Festive',
      alias: 'Festive',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id: uuidv1(),
      name: 'Birthday',
      alias: 'Birthday',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id: uuidv1(),
      name: 'Rakhi Return Gifts',
      alias: 'Rakhi Return Gifts',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id: uuidv1(),
      name: 'Everyday',
      alias: 'Everyday',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id: uuidv1(),
      name: 'Mother\'s Day',
      alias: 'Mother\'s Day',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('master_occasions', null, {});

  }
};