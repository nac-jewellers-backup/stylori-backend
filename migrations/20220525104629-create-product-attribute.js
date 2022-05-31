"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("product_attributes", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("uuid_generate_v4()"),
      },
      attribute_name: {
        type: Sequelize.STRING,
      },
      product_id: {
        type: Sequelize.STRING,
        references: {
          model: "product_lists", // name of Source model
          key: "product_id",
        },
      },
      master_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Attribute_masters", // name of Source model
          key: "id",
        },
      },
      attribute_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "attributes", // name of Source model
          key: "id",
        },
      },
      is_active: {
        type: Sequelize.BOOLEAN,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("product_attributes");
  },
};
