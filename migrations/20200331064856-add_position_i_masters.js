'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'master_product_categories',
        'filter_order',
        {
          type: Sequelize.INTEGER,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'master_product_categories',
        'is_filter',
        {
          type: Sequelize.BOOLEAN,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'master_product_categories',
        'is_active',
        {
          type: Sequelize.BOOLEAN,
          allowNull: true
        }
      ),
      
      queryInterface.addColumn(
        'master_product_types',
        'is_filter',
        {
          type: Sequelize.BOOLEAN,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'master_product_types',
        'is_active',
        {
          type: Sequelize.BOOLEAN,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'master_materials',
        'filter_order',
        {
          type: Sequelize.INTEGER,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'master_materials',
        'is_filter',
        {
          type: Sequelize.BOOLEAN,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'master_materials',
        'is_active',
        {
          type: Sequelize.BOOLEAN,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'master_metals_colors',
        'filter_order',
        {
          type: Sequelize.INTEGER,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'master_metals_colors',
        'is_filter',
        {
          type: Sequelize.BOOLEAN,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'master_metals_colors',
        'is_active',
        {
          type: Sequelize.BOOLEAN,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'master_metals_purities',
        'filter_order',
        {
          type: Sequelize.INTEGER,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'master_metals_purities',
        'is_filter',
        {
          type: Sequelize.BOOLEAN,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'master_metals_purities',
        'is_active',
        {
          type: Sequelize.BOOLEAN,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'master_collections',
        'filter_order',
        {
          type: Sequelize.INTEGER,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'master_collections',
        'is_filter',
        {
          type: Sequelize.BOOLEAN,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'master_collections',
        'is_active',
        {
          type: Sequelize.BOOLEAN,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'master_styles',
        'filter_order',
        {
          type: Sequelize.INTEGER,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'master_styles',
        'is_filter',
        {
          type: Sequelize.BOOLEAN,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'master_styles',
        'is_active',
        {
          type: Sequelize.BOOLEAN,
          allowNull: true
        }
      ),

      queryInterface.addColumn(
        'master_themes',
        'filter_order',
        {
          type: Sequelize.INTEGER,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'master_themes',
        'is_filter',
        {
          type: Sequelize.BOOLEAN,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'master_themes',
        'is_active',
        {
          type: Sequelize.BOOLEAN,
          allowNull: true
        }
      ),

      queryInterface.addColumn(
        'master_designs',
        'filter_order',
        {
          type: Sequelize.INTEGER,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'master_designs',
        'is_filter',
        {
          type: Sequelize.BOOLEAN,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'master_designs',
        'is_active',
        {
          type: Sequelize.BOOLEAN,
          allowNull: true
        }
      ),

      queryInterface.addColumn(
        'master_weights',
        'filter_order',
        {
          type: Sequelize.INTEGER,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'master_weights',
        'is_filter',
        {
          type: Sequelize.BOOLEAN,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'master_weights',
        'is_active',
        {
          type: Sequelize.BOOLEAN,
          allowNull: true
        }
      ),

      queryInterface.addColumn(
        'master_diamond_types',
        'filter_order',
        {
          type: Sequelize.INTEGER,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'master_diamond_types',
        'is_filter',
        {
          type: Sequelize.BOOLEAN,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'master_diamond_types',
        'is_active',
        {
          type: Sequelize.BOOLEAN,
          allowNull: true
        }
      ),

      queryInterface.addColumn(
        'master_diamonds_colors',
        'filter_order',
        {
          type: Sequelize.INTEGER,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'master_diamonds_colors',
        'is_filter',
        {
          type: Sequelize.BOOLEAN,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'master_diamonds_colors',
        'is_active',
        {
          type: Sequelize.BOOLEAN,
          allowNull: true
        }
      ),


      queryInterface.addColumn(
        'master_diamonds_settings',
        'filter_order',
        {
          type: Sequelize.INTEGER,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'master_diamonds_settings',
        'is_filter',
        {
          type: Sequelize.BOOLEAN,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'master_diamonds_settings',
        'is_active',
        {
          type: Sequelize.BOOLEAN,
          allowNull: true
        }
      ),
      
      queryInterface.addColumn(
        'master_diamonds_shapes',
        'filter_order',
        {
          type: Sequelize.INTEGER,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'master_diamonds_shapes',
        'is_filter',
        {
          type: Sequelize.BOOLEAN,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'master_diamonds_shapes',
        'is_active',
        {
          type: Sequelize.BOOLEAN,
          allowNull: true
        }
      ),


      queryInterface.addColumn(
        'master_earring_backings',
        'filter_order',
        {
          type: Sequelize.INTEGER,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'master_earring_backings',
        'is_filter',
        {
          type: Sequelize.BOOLEAN,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'master_earring_backings',
        'is_active',
        {
          type: Sequelize.BOOLEAN,
          allowNull: true
        }
      ),


      queryInterface.addColumn(
        'master_gemstones_settings',
        'filter_order',
        {
          type: Sequelize.INTEGER,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'master_gemstones_settings',
        'is_filter',
        {
          type: Sequelize.BOOLEAN,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'master_gemstones_settings',
        'is_active',
        {
          type: Sequelize.BOOLEAN,
          allowNull: true
        }
      ),

      queryInterface.addColumn(
        'master_gemstones_shapes',
        'filter_order',
        {
          type: Sequelize.INTEGER,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'master_gemstones_shapes',
        'is_filter',
        {
          type: Sequelize.BOOLEAN,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'master_gemstones_shapes',
        'is_active',
        {
          type: Sequelize.BOOLEAN,
          allowNull: true
        }
      ),

      queryInterface.addColumn(
        'master_gemstones_types',
        'filter_order',
        {
          type: Sequelize.INTEGER,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'master_gemstones_types',
        'is_filter',
        {
          type: Sequelize.BOOLEAN,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'master_gemstones_types',
        'is_active',
        {
          type: Sequelize.BOOLEAN,
          allowNull: true
        }
      ),
      
      queryInterface.addColumn(
        'master_stones',
        'filter_order',
        {
          type: Sequelize.INTEGER,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'master_stones',
        'is_filter',
        {
          type: Sequelize.BOOLEAN,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'master_stones',
        'is_active',
        {
          type: Sequelize.BOOLEAN,
          allowNull: true
        }
      ),

      queryInterface.addColumn(
        'master_stones_colors',
        'filter_order',
        {
          type: Sequelize.INTEGER,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'master_stones_colors',
        'is_filter',
        {
          type: Sequelize.BOOLEAN,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'master_stones_colors',
        'is_active',
        {
          type: Sequelize.BOOLEAN,
          allowNull: true
        }
      ),
      
      queryInterface.addColumn(
        'master_stones_shapes',
        'filter_order',
        {
          type: Sequelize.INTEGER,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'master_stones_shapes',
        'is_filter',
        {
          type: Sequelize.BOOLEAN,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'master_stones_shapes',
        'is_active',
        {
          type: Sequelize.BOOLEAN,
          allowNull: true
        }
      ),
      
      queryInterface.addColumn(
        'master_genders',
        'filter_order',
        {
          type: Sequelize.INTEGER,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'master_genders',
        'is_filter',
        {
          type: Sequelize.BOOLEAN,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'master_genders',
        'is_active',
        {
          type: Sequelize.BOOLEAN,
          allowNull: true
        }
      ),
    ]);
  },

  down: (queryInterface, Sequelize) => {
   
  }
};
