const mongoose = require("mongoose");

const DbConnect = mongoose.connect(process.env.DB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = DbConnect;
