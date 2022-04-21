const models = require("../../models");

const calculateGoldPrice = ({ sku, vendor_code }) => {
  return new Promise((resolve, reject) => {
    let { purity, sku_weight } = sku;
    models.gold_price_settings
      .findOne({
        where: {
          vendor_code,
          purity: parseInt(purity.replace("K", "").replace(".", "")),
        },
      })
      .then((goldPriceSetting) => {
        let cost_price = sku_weight * goldPriceSetting.cost_price;
        let selling_price = sku_weight * goldPriceSetting.selling_price;
        if (goldPriceSetting.selling_price_type == 2) {
          selling_price =
            cost_price * (1 + goldPriceSetting.selling_price / 100);
        }
        resolve({
          cost_price,
          selling_price,
        });
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports = calculateGoldPrice;
