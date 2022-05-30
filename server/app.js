const express = require("express");
const app = express();

require("dotenv").config();
var bodyParser = require('body-parser')
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true }));

const cors = require("cors");
app.use(cors());

var api = require("./routes/router");
app.use("/", api);
const port = process.env.PORT;
app.listen(port,  () => {
    console.log(`Example app listening on port ${port}`);
  });

module.exports = app;
