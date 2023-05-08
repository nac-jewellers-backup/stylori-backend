import { sum } from "lodash";
import { sendStatus } from "../../middlewares/socket";

const models = require("./../../models");
const csv = require("csvtojson");
const arrayChunk = require("array-chunk");

const DISCOUNT_TYPE = {
  PERCENTAGE: "PERCENTAGE",
  FLAT: "FLAT",
};

export const upsertComboOffers = ({ filepath }) => {
  let comboArray = [];
  return new Promise((resolve, reject) => {
    csv()
      .fromFile(filepath)
      .on("data", (data) => {
        const jsonStr = data.toString("utf8");
        comboArray.push(JSON.parse(jsonStr));
      })
      .on("end", async () => {
        console.log(">>>>>>>>>>> Starting Sync >>>>>>>>>>>>>>>");
        try {
          let completedCombos = 0;
          const totalComboOffers = comboArray.length;
          comboArray = arrayChunk(comboArray, 500);
          for (let index = 0; index < comboArray.length; index++) {
            let element = comboArray[index];
            element = element.map((i) => {
              if (i.discount_type) {
                Object.keys(DISCOUNT_TYPE).forEach((type) => {
                  if (
                    i.discount_type
                      .toLowerCase()
                      .includes(DISCOUNT_TYPE[type].toLowerCase())
                  )
                    i.discount_type = DISCOUNT_TYPE[type];
                });
              }
              i.offered_products = i.offered_products?.split(",");
              return i;
            });
            await models.product_combo_offer.bulkCreate(element, {
              updateOnDuplicate: ["main_product"],
            });
            completedCombos += comboArray[index].length;
            sendStatus("combo_sync", {
              status:
                completedCombos == totalComboOffers
                  ? "completed"
                  : "in-progress",
              completed: completedCombos / totalComboOffers,
            });
            resolve("completed");
          }
        } catch (error) {
          console.log(error);
        }
      })
      .on("error", (err) => {
        console.error(err);
        reject(err);
      });
  });
};

export const displayComboOffer = ({ product_id: main_product }) => {
  return new Promise(async (resolve, reject) => {
    let comboOffer = (
      await models.product_combo_offer.findOne({
        where: { main_product, is_active: true },
        include: {
          model: models.trans_sku_lists,
          attributes: ["markup_price", "discount_price"],
          include: {
            model: models.product_lists,
            attributes: ["product_name"],
            include: {
              model: models.product_images,
              attributes: [
                ["ishover", "ishover"],
                ["image_url", "imageUrl"],
                ["image_position", "imagePosition"],
                ["isdefault", "isdefault"],
              ],
              where: {
                isdefault: true,
                image_position: {
                  [models.Sequelize.Op.in]: [1, 2],
                },
              },
              required: false,
            },
          },
        },
      })
    ).toJSON();
    if (!comboOffer) {
      return reject(new Error("No Combo offer exists!"));
    }
    let offeredProducts = await models.trans_sku_lists.findAll({
      attributes: ["markup_price", "discount_price"],
      include: {
        model: models.product_lists,
        attributes: ["product_name"],
        include: {
          model: models.product_images,
          attributes: [
            ["ishover", "ishover"],
            ["image_url", "imageUrl"],
            ["image_position", "imagePosition"],
            ["isdefault", "isdefault"],
          ],
          where: {
            isdefault: true,
            image_position: {
              [models.Sequelize.Op.in]: [1, 2],
            },
          },
          required: false,
        },
      },
      where: {
        product_id: {
          [models.Sequelize.Op.in]: comboOffer.offered_products,
        },
      },
    });
    offeredProducts = JSON.parse(JSON.stringify(offeredProducts));
    let comboProducts = [
      {
        ...comboOffer.trans_sku_list.product_list,
        markup_price: comboOffer.trans_sku_list.markup_price,
        discount_price: comboOffer.trans_sku_list.discount_price,
      },
      ...offeredProducts.map((i) => {
        return {
          ...i.product_list,
          markup_price: i.markup_price,
          discount_price: i.discount_price,
        };
      }),
    ];
    let totalPrice = sum(comboProducts.map((i) => i.markup_price || 0));
    let offerPrice = totalPrice;
    if (comboOffer.discount_type == DISCOUNT_TYPE.PERCENTAGE) {
      offerPrice = (offerPrice * (1 - comboOffer.discount_value / 100)).toFixed(
        2
      );
    }
    resolve({
      discount_type: comboOffer.discount_type,
      discount_value: comboOffer.discount_value,
      totalPrice,
      offerPrice,
      comboProducts,
    });
  });
};
