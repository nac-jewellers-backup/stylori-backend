const moment = require("moment");
const models = require("./../models");
const { findIndex } = require("lodash");
const { v4: uuidv4 } = require("uuid");

let addHolidays = (holidays) => {
  return new Promise((resolve, reject) => {
    try {
      if (!Array.isArray(holidays) || holidays.length < 1) {
        throw new Error("Please send holidays in an array");
      }
      models.holiday_manager
        .bulkCreate(
          holidays.map((item) => {
            return {
              holiday_date: moment(item.holiday_date, [
                "DD/MM/YYYY",
                "DD-MM-YYYY",
              ]),
            };
          }),
          {
            ignoreDuplicates: true,
          }
        )
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    } catch (error) {
      reject(error);
    }
  });
};

let addInventories = async (inventoryList) => {
  var warehouse = await models.warehouse.findAll({
    attributes: ["id", "name"],
  });

  var getWarehouseId = (warehouseName) => {
    var index = findIndex(warehouse, (item) => {
      return item.name == warehouseName;
    });
    return warehouse[index].id;
  };

  return new Promise(async (resolve, reject) => {
    try {
      if (!Array.isArray(inventoryList) || inventoryList.length < 1) {
        throw new Error("Please send inventory lists in an array");
      }

      Promise.all(
        inventoryList.map(async (element) => {
          var item = {
            generated_sku: element.TAGNO,
            warehouse_id: getWarehouseId(element.warehouse_name),
          };
          models.inventory
            .findOne({ attributes: ["id"], where: { ...item } })
            .then(async (result) => {
              if (result) {
                await models.inventory.update(
                  { number_of_items: element.quantity },
                  { where: { id: result.id } }
                );
              } else {
                await models.inventory.create({
                  id: `${uuidv4()}`,
                  ...item,
                  number_of_items: element.quantity,
                });
              }
            });
        })
      ).then(async (_) => {
        await models.sequelize
          .query(`update inventories set sku_id = tk.sku_id from trans_sku_lists tk 
                where tk.generated_sku = inventories.generated_sku and inventories.sku_id is null
            `);
        resolve("Completed!");
      });
    } catch (error) {
      reject(error);
    }
  });
};

let getShippingDate = async ({ sku_id, current_datetime }) => {
  if (!current_datetime) {
    current_datetime = moment();
  }

  var warehouse = await models.warehouse.findAll({
    attributes: ["shipping_in_days"],
    order: [["shipping_in_days", "asc"]],
  });

  var getHolidayCount = (currentDate, shippingDate) => {
    return new Promise((resolve, reject) => {
      models.holiday_manager
        .count({
          where: {
            holiday_date: {
              [models.Sequelize.Op.gte]: currentDate,
              [models.Sequelize.Op.lt]: shippingDate,
            },
          },
        })
        .then((result) => resolve(result))
        .catch((err) => reject(err));
    });
  };

  return new Promise(async (resolve, reject) => {
    models.trans_sku_lists
      .findOne({
        attributes: ["is_ready_to_ship", "is_active", "vendor_delivery_time"],
        include: [
          { model: models.product_lists, attributes: ["isreorderable"] },
          {
            model: models.inventory,
            attributes: ["number_of_items"],
            include: {
              model: models.warehouse,
              attributes: ["shipping_in_days"],
            },
          },
        ],
        where: { sku_id },
        order: [
          [models.inventory, models.warehouse, "shipping_in_days", "asc"],
        ],
      })
      .then(async (result) => {
        // resolve(result);
        var duration = moment
          .duration(moment(current_datetime).diff(moment({ hour: 14 })))
          .as("minutes");

        if (!result.is_active) {
          resolve({ status: "Enquire Now", shipping_date: null });
        }
        if (
          result.is_active &&
          Array.isArray(result.inventories) &&
          result.inventories.length == 0
        ) {
          if (!result.product_list.isreorderable)
            resolve({ status: "Enquire Now", shipping_date: null });
          else {
            var totalDaysToShip =
              result.vendor_delivery_time +
                warehouse[0].shipping_in_days +
                duration >
                  10
                ? 0
                : 1;
            var shippingDate = moment().set("date", totalDaysToShip);
            var holidayCount = getHolidayCount(
              moment(current_datetime),
              shippingDate
            );
            if (holidayCount > 0) {
              shippingDate.set("date", holidayCount);
            }
          }
          resolve({ status: "Enquire Now", shipping_date: shippingDate });
        }
        if (result.is_active && Array.isArray(result.inventories)) {
          var totalDaysToShip =
            result.inventories[0].warehouse.shipping_in_days + duration > 10
              ? 0
              : 1;
          var shippingDate = moment().set("date", totalDaysToShip);
          var holidayCount = getHolidayCount(
            moment(current_datetime),
            shippingDate
          );
          if (holidayCount > 0) {
            shippingDate.set("date", holidayCount);
          }
        }
      })
      .catch((err) => reject(err));
  });
};

module.exports = {
  addHolidays,
  addInventories,
  getShippingDate,
};
