'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('product_lists', {
      id: {
        allowNull: false,
        type: Sequelize.UUID
      },
      product_id: {
        type: Sequelize.STRING,
        primaryKey: true,
        
      },
      product_series: {
        type: Sequelize.INTEGER
      },
      product_category: {
        type: Sequelize.STRING,
        
      },
     
      vendor_code: {
        type: Sequelize.STRING
      },
      product_name: {
        type: Sequelize.STRING
      },
      isactive: {
        type: Sequelize.BOOLEAN
      },
      default_size: {
        type: Sequelize.DOUBLE
      },
      default_weight: {
        type: Sequelize.DOUBLE
      },
      gender: {
        type: Sequelize.STRING
      },
      height: {
        type: Sequelize.DOUBLE
      },
      width: {
        type: Sequelize.DOUBLE
      },
      length: {
        type: Sequelize.DOUBLE
      },
      product_type: {
        type: Sequelize.STRING
      },
      product_vendor_code: {
        type: Sequelize.STRING
      },
      product_sizes: {
        type: Sequelize.STRING
      },
      size_varient: {
        type: Sequelize.STRING
      },
      colour_varient: {
        type: Sequelize.STRING
      },
      by_design: {
        type: Sequelize.STRING
      },
      by_weight: {
        type: Sequelize.STRING
      },
      earring_backing:{
        type: Sequelize.STRING
      },
      selling_qty: {
        type: Sequelize.INTEGER
      },
      max_booking_qty: {
        type: Sequelize.INTEGER
      },
      isreorderable: {
        type: Sequelize.BOOLEAN
      },
      iscomponentpricing: {
        type: Sequelize.BOOLEAN
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('product_lists');
  }
};