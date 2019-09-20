'use strict';
module.exports = {
  up: (queryInterface) => {
    return queryInterface.createSchema('auth')
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropSchema('auth');
  }
};