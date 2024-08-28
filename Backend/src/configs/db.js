const { connect } = require("mongoose");

const connnetToDB = async (url) => {
  await connect(url);
};

module.exports = connnetToDB;
