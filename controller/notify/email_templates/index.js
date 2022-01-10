const ejs = require("ejs");
const path = require("path");
exports.createTemplate = ({ type, data }) => {
  return new Promise((resolve, reject) => {
    ejs
      .renderFile(
        path.join(__dirname, `${type}.ejs`),
        data
      )
      .then(resolve)
      .catch(reject);
  });
};
