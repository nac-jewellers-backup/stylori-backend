const models = require("../../models");

const calculateMakingCharge = ({ sku, vendor_code }) => {
  return new Promise((resolve, reject) => {
    let { purity, sku_weight, generated_sku } = sku;
    let making_cost_price = 0;
    let making_selling_price = 0;
    models.making_charge_settings
      .findAll({
        where: {
          vendor_code,
          purity: parseInt(purity.replace("K", "").replace(".", "")),
          material: "Gold",
          weight_start: {
            [models.Sequelize.Op.lte]: sku_weight,
          },
          weight_end: {
            [models.Sequelize.Op.gte]: sku_weight,
          },
        },
      })
      .then((charges) => {
        let result = {
          status: "success",
        };
        if (charges.legth == 0) {
          resolve({ ...result, status: "no-data" });
        } else {
          charges.forEach((element) => {
            if (element.price_type == 1) {
              if (element.rate_type == 1) {
                making_cost_price = element.price;
              } else {
                making_cost_price = sku_weight * element.price;
              }
            }
            if (element.price_type == 2) {
              if (element.rate_type == 1) {
                if (element.selling_price_type == 1) {
                  making_selling_price = element.price;
                } else if (element.selling_price_type == 2) {
                  making_selling_price =
                    making_cost_price * (1 + element.price / 100);
                }
              } else if (element.rate_type == 2) {
                if (element.selling_price_type == 1) {
                  making_selling_price = element.price;
                } else if (element.selling_price_type == 2) {
                  making_selling_price = sku_weight * element.price;
                }
              }
            }
          });
          resolve({
            ...result,
            making_charge: {
              material_name: "makingcharge",
              cost_price: making_cost_price,
              selling_price: making_selling_price,
              markup: making_selling_price,
              discount_price: making_selling_price,
              margin_percentage: (
                ((making_selling_price - making_cost_price) * 100) /
                making_cost_price
              ).toFixed(0),
              product_sku: generated_sku,
            },
          });
        }
      });
  });
};

module.exports = calculateMakingCharge;
