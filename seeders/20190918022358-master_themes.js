'use strict';
const uuidv1 = require('uuid/v1');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('master_themes', [{
      id: uuidv1(),
      name: 'Random',
      alias: 'Random',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv1(),
      name: 'Fashion',
      alias: 'Fashion',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv1(),
      name: 'Cut Out',
      alias: 'Cut Out',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv1(),
      name: 'Designer',
      alias: 'Designer',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv1(),
      name: 'Tiny Studs',
      alias: 'Tiny Studs',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv1(),
      name: 'Hook-Type',
      alias: 'Hook-Type',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv1(),
      name: 'Religious',
      alias: 'Religious',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv1(),
      name: 'Floral',
      alias: 'Floral',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv1(),
      name: 'Waves',
      alias: 'Waves',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv1(),
      name: 'Trendy',
      alias: 'Trendy',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv1(),
      name: 'Sports',
      alias: 'Sports',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv1(),
      name: 'Cluster',
      alias: 'Cluster',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id: uuidv1(),
      name: 'Chic',
      alias: 'Chic',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv1(),
      name: 'Essentials',
      alias: 'Essentials',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv1(),
      name: 'Tiara',
      alias: 'Tiara',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv1(),
      name: 'Droplets',
      alias: 'Droplets',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv1(),
      name: 'Hearts',
      alias: 'Hearts',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv1(),
      name: 'J-Stud',
      alias: 'J-Stud',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv1(),
      name: 'Enamel',
      alias: 'Enamel',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv1(),
      name: 'Hoops',
      alias: 'Hoops',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('master_themes', null, {});

  }
};