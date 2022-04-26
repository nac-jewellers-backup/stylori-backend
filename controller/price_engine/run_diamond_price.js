const models = require("../../models");

const calculateDiamondPrice = ({ product_id, vendor_code }) => {
  return new Promise((resolve, reject) => {
    models.product_diamonds
      .findAll({
        where: {
          product_sku: product_id,
        },
      })
      .then((diamondList) => {
        let results = {
          status: "success",
          diamonds: [],
        };
        if (diamondList.length == 0) {
          resolve({
            ...results,
            status: "no-data",
          });
        } else {
          Promise.all(
            diamondList.map(async (diamond, index) => {
              let condition = {
                vendor_code,
                diamond_colour: diamond.diamond_clarity,
                diamond_clarity: diamond.diamond_colour,
              };
              models.diamond_price_settings
                .findOne({
                  where: condition,
                })
                .then((charge) => {
                  var diamond_cost_price =
                    diamond.stone_weight * charge.cost_price;
                  var diamond_selling_price =
                    diamond.stone_weight * charge.selling_price;

                  results.diamonds.push({
                    component: "diamond" + (index + 1) + "_" + product_id,
                    material_name:
                      diamond.diamond_clarity + "" + diamond.diamond_colour,
                    margin_percentage: (
                      ((diamond_selling_price - diamond_cost_price) /
                        diamond_cost_price) *
                      100
                    ).toFixed(0),
                    cost_price: diamond_cost_price,
                    selling_price: diamond_selling_price,
                    markup_price: diamond_selling_price,
                    discount_price: diamond_selling_price,
                    product_id: product_id,
                  });
                })
                .catch((err) => console.log(err));
            })
          )
            .then(() => {
              resolve(results);
            })
            .catch((err) => {
              reject(err);
            });
        }
      });
  });
};

module.exports = calculateDiamondPrice;
