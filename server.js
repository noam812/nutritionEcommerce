require("dotenv").config({ path: "./config.env" });
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

async function main() {
  const PORT = process.env.PORT || 3002;
  const app = express();
  app.use(cors());
  app.use(express.json());

  mongoose.connect(
    process.env.DB_CONNECTION,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    () => console.log("connected to db")
  );

  const userRoute = require("./routers/user");
  app.use(`/users`, userRoute);

  app.listen(PORT, () => {
    console.log(`Listening on port : ${PORT}`);
  });
}
main();
