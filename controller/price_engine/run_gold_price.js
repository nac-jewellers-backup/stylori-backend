const models = require("../../models");

const calculateGoldPrice = ({ product_id, sku, vendor_code }) => {
  return new Promise((resolve, reject) => {
    let { purity, sku_weight } = sku;
    models.gold_price_settings
      .findOne({
        where: {
          vendor_code,
          purity: parseInt(purity.replace("K", "").replace(".", "")),
        },
      })
      .then(async (goldPriceSetting) => {
        let cost_price = sku_weight * goldPriceSetting.cost_price;
        let selling_price = sku_weight * goldPriceSetting.selling_price;
        if (goldPriceSetting.selling_price_type == 2) {
          selling_price =
            cost_price * (1 + goldPriceSetting.selling_price / 100);
        }
        await models.temp_price_list.upsert({
          product_id,
          generated_sku: sku.generated_sku,
          pricing: {
            pricing_sku_metals: [
              {
                material_name: "goldprice",
                cost_price: cost_price.toFixed(2),
                selling_price: selling_price.toFixed(2),
                markup_price: selling_price.toFixed(2),
                discount_price: selling_price.toFixed(2),
              },
            ],
          },
        });
        resolve({
          cost_price: cost_price.toFixed(2),
          selling_price: selling_price.toFixed(2),
          markup_price: selling_price.toFixed(2),
          discount_price: selling_price.toFixed(2),
        });
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports = calculateGoldPrice;
