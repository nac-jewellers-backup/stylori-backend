const models = require("./../models");
import "dotenv/config";
const Op = require("sequelize").Op;
import apidata from "./apidata.json";
const uuidv1 = require("uuid/v1");
var splitArray = require("split-array");

exports.updatesize = async (req, res) => {
  try {
    req.setTimeout(50000000);

    let processcount = 0;
    // res.send(200,"success");

    var products = await models.product_lists.findAll({
      where: {
        isactive: true,
        product_id: {
          [Op.iLike]: "%SB%",
        },
      },
    });
    //res.send(200,products)
    processproduct();
    async function processproduct() {
      if (products.length > processcount) {
        const prod_id = products[processcount].product_id;
        let prod_size_varient = [];
        var uniquesizes = await models.trans_sku_lists.findAll({
          attributes: ["sku_size"],
          group: ["sku_size"],
          where: {
            sku_size: {
              [Op.ne]: null,
            },
            product_id: prod_id,
          },
        });
        uniquesizes.forEach((prod_sizes) => {
          prod_size_varient.push(prod_sizes.sku_size);
        });
        //   models.product_lists.update(
        //     // Values to update
        //     {
        //         sku_size:  prod_size_varient.join(',')
        //     },
        //     { // Clause
        //         where:
        //         {
        //           product_id: prod_id
        //         }
        //     }
        // ).then(count => {
        //     console.log('Rows updated ' + count);
        //     prod_size_varient = [];
        //          processcount++;
        //          processproduct()
        // });
        var query =
          "UPDATE product_lists SET size_varient = '" +
          prod_size_varient.join(",") +
          "' where product_id = '" +
          prod_id +
          "'";
        await models.sequelize.query(query).then(([results, metadata]) => {
          console.log("completed" + processcount);
          console.log("completed" + JSON.stringify(results));
          console.log("completed" + JSON.stringify(metadata));

          prod_size_varient = [];
          processcount++;
          processproduct();
          // Results will be an empty array and metadata will contain the number of affected rows.
        });
        // var uniquecolors =    await models.trans_sku_lists.findAll({
        //   attributes: ['metal_color'],
        //   group: ['metal_color'],
        //   where: {
        //       product_id : prod_id
        //   }
        // })

        // console.log(JSON.stringify(uniquecolors))
        // var uniquepurity =   await models.trans_sku_lists.findAll({
        //   attributes: ['purity'],
        //   group: ['purity'],
        //   where: {
        //       product_id : prod_id
        //   }
        // })

        // let prod_purity_varient = []
        //     uniquepurity.forEach(purity_obj => {
        //       uniquecolors.forEach(color_obj => {
        //           prod_purity_varient.push(purity_obj.purity+' '+color_obj.metal_color);
        //       })
        //     })
        //     console.log(JSON.stringify(prod_purity_varient))

        // console.log("completed"+JSON.stringify(prod_purity_varient))
        //res.send(200, {sizes:prod_size_varient.join(',')})
        // var query = "UPDATE product_lists SET colour_varient = '"+prod_purity_varient.join(',')+"' where product_id ='"+prod_id+"'" ;
        //      await  models.sequelize.query(query).then(([results, metadata]) => {
        //             console.log("completed"+processcount)
        //             prod_purity_varient = [];
        //             processcount++;
        //             processproduct()
        //             // Results will be an empty array and metadata will contain the number of affected rows.
        //              })
      } else {
        console.log("request completed");
        res.send(200, { message: "success" });
      }
    }
  } catch (err) {
    console.log(
      new Date().toLocaleString("en-US", {
        timeZone: "Asia/Calcutta",
      }) +
        " - Error message : " +
        err
    );
  }
};
