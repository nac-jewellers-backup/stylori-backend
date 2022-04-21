const models = require("../../models");

const calculateGemstonePrice = ({ product_id, vendor_code }) => {
  return new Promise((resolve, reject) => {
    models.product_gemstones
      .findAll({
        where: {
          product_sku: product_id,
        },
      })
      .then((gemstoneList) => {
        let results = {
          status: "success",
          gemstones: [],
        };
        if (gemstoneList.length == 0) {
          resolve({
            ...results,
            status: "no-data",
          });
        } else {
          Promise.all(
            gemstoneList.map(async (gemstone, index) => {
              let condition = {
                vendor_code,
                gemstone_type: {
                  [models.Sequelize.Op.iLike]: gemstone.gemstone_type,
                },
              };

              if (gemstone.stone_weight) {
                var stoneweight = gemstone.stone_weight / gemstone.stone_count;
                condition["weight_start"] = {
                  [models.Sequelize.Op.lte]: stoneweight,
                };
                condition["weight_end"] = {
                  [models.Sequelize.Op.gte]: stoneweight,
                };
              } else {
                condition["rate_type"] = 2;
              }

              models.gemstone_price_settings
                .findAll({
                  where: condition,
                })
                .then(async (charges) => {
                  var gemstone_markup = 0;
                  var gemstone_cost = 0;
                  var gemstone_selling_price = 0;
                  var cost_price_type = 0;
                  var sell_price_type = 0;
                  var sell_percent_flat = 0;

                  charges.forEach((element) => {
                    if (element.price_type == 1) {
                      gemstone_cost = element.price;
                      cost_price_type = element.rate_type;
                    } else if (element.price_type == 2) {
                      gemstone_selling_price = element.price;
                      sell_price_type = element.rate_type;
                      sell_percent_flat = element.selling_price_type;
                    }
                  });

                  if (cost_price_type == 1) {
                    if (gemstone.stone_weight) {
                      gemstone_cost = gemstone_cost * gemstone.stone_weight;
                    } else {
                      gemstone_cost = gemstone_cost * gemstone.stone_count;
                    }
                  }

                  if (sell_price_type == 1) {
                    if (sell_percent_flat == 2) {
                      gemstone_selling_price =
                        gemstone_cost +
                        gemstone_cost * (gemstone_selling_price / 100);
                    } else {
                      gemstone_selling_price =
                        gemstone.stone_weight * gemstone_selling_price;
                    }
                  } else if (sell_price_type == 2) {
                    if (gemstone.stone_count) {
                      gemstone_selling_price =
                        gemstone.stone_count * gemstone_selling_price;
                    }
                  }

                  gemstone_markup = await models.material_markups.findOne({
                    where: {
                      material_name: "gemstone",
                      price_min: {
                        [models.Sequelize.Op.lte]: gemstone_selling_price,
                      },
                      price_max: {
                        [models.Sequelize.Op.gte]: gemstone_selling_price,
                      },
                    },
                  });

                  if (gemstone_markup) {
                    if (gemstone_markup.markup_type == 1) {
                      gemstone_selling_price = gemstone_markup.markup_value;
                    }
                  }
                  let gemstone_margin =
                    ((gemstone_selling_price - gemstone_cost) / gemstone_cost) *
                    100;

                  results.gemstones.push({
                    component: "gemstone" + (index + 1),
                    material_name: gemstone.gemstone_type,
                    margin_percentage: gemstone_margin.toFixed(0),
                    cost_price: gemstone_cost,
                    selling_price: gemstone_selling_price,
                    markup: gemstone_selling_price,
                    discount_price: gemstone_selling_price,
                  });
                })
                .catch((err) => console.log(err));
            })
          )
            .then(() => {
              resolve(results);
            })
            .catch(reject);
        }
      });
  });
};

module.exports = calculateGemstonePrice;
