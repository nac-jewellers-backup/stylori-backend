'use strict';
const uuidv1 = require('uuid/v1');
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('master_collections', [
      {
        id: uuidv1(),
        name: 'Paisley',
        alias: 'Paisley',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv1(),
        name: 'Monsoon',
        alias: 'Monsoon',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv1(),
        name: 'Mistletoe',
        alias: 'Mistletoe',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv1(),
        name: 'Spiral',
        alias: 'Spiral',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv1(),
        name: 'Hanging Gardens',
        alias: 'Hanging Gardens',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv1(),
        name: 'Summer',
        alias: 'Summer',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv1(),
        name: 'Fauna',
        alias: 'Fauna',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv1(),
        name: 'Molecute collection',
        alias: 'Molecute collection',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv1(),
        name: 'The Renaissance',
        alias: 'The Renaissance',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv1(),
        name: 'Indo Western',
        alias: 'Indo Western',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv1(),
        name: 'Geometric',
        alias: 'Geometric',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv1(),
        name: 'Galaxy',
        alias: 'Galaxy',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv1(),
        name: 'Loops',
        alias: 'Loops',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv1(),
        name: 'Flower and Petal',
        alias: 'Flower and Petal',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv1(),
        name: 'Engrave collection',
        alias: 'Engrave collection',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv1(),
        name: 'Bouquet of Love',
        alias: 'Bouquet of Love',
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
        name: 'Trinity',
        alias: 'Trinity',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv1(),
        name: 'Carve',
        alias: 'Carve',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv1(),
        name: 'Affordable Diamonds',
        alias: 'Affordable Diamonds',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv1(),
        name: 'Butterfly',
        alias: 'Butterfly',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv1(),
        name: 'Blush',
        alias: 'Blush',
        createdAt: new Date(),
        updatedAt: new Date()
      }],{})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('master_collections', null, {});
  }
};
