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
