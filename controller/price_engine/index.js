const models = require("../../models");
const calculateDiamondPrice = require("./run_diamond_price");
const calculateGemstonePrice = require("./run_gemstone_price");
const calculateGoldPrice = require("./run_gold_price");
const calculateMakingCharge = require("./run_making_charge");

const price_engine = ({ product_id }) => {
  return new Promise((resolve, reject) => {
    models.product_lists
      .findOne({
        include: { model: models.trans_sku_lists },
        where: { product_id },
      })
      .then(async (product) => {
        let response = {};
        for (let index = 0; index < product.trans_sku_lists.length; index++) {
          const sku = product.trans_sku_lists[index];
          const diamond_price_details = await calculateDiamondPrice({
            product_id,
            vendor_code: product.vendor_code,
          });
          const gemstone_price_details = await calculateGemstonePrice({
            product_id,
            vendor_code: product.vendor_code,
          });
          response[sku.generated_sku] = {
            gold: await calculateGoldPrice({
              sku,
              vendor_code: product.vendor_code,
            }),
            making_charge: await calculateMakingCharge({
              sku,
              vendor_code: product.vendor_code,
            }),
            diamond: diamond_price_details,
            gemstone: gemstone_price_details,
          };
        }
        resolve(response);
      })
      .catch(reject);
  });
};

module.exports = price_engine;
