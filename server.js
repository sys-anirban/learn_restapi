const express = require("express");
const app = express();
const middlewares = require("./middleware");
const mongoose = require("mongoose");

app.use(middlewares);

mongoose
  .connect(process.env.db_connect)
  .then((res) => {
    console.log("connected");
    app.listen(process.env.PORT || 8080);
  })
  .catch((err) => console.log(err));
