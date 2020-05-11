const express = require("express");
const app = express();
const mongoose = require("mongoose");
const config = require("config");
const sql = require("mssql");

const logger = require("./middleware/logger");

const courses = require("./routes/courses");
const home = require("./routes/home");

app.set("view engine", "ejs");
app.set("views", "./views");

//const connStr = "mongodb://localhost:27017/?readPreference=primary&ssl=false";
app.use("/", home);
app.use("/api/courses", courses);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

mongoose
  .connect(config.get("Shipping.MongoDB.connstr"), { useNewUrlParser: true })
  .then(() => console.log("MongoDB connected..."))
  .catch(() => console.error("MongoDB connect failed..."));

var shipping = new mongoose.Schema({
  UserName: String,
  UserToken: String,
  UserIp: String,
  CreateOnDate: Date,
  Tel: String,
  TruckPlate: String,
  CenterCode: String, //2位
  ReceiveCode: String, //4位
  UploadedReceipt: String, //上传图片url
});

const dbConfig = config.get("Shipping.SqlServer.connstr");
console.log("dbConfig:", dbConfig);

//const sql = require("mssql");
sql.on("error", (err) => {
  console.log("Error connect SQL Server:", err.message);
});

sql
  .connect(dbConfig)
  .then((pool) => {
    return pool
      .request()
      .input("input_parameter", sql.Int, 1)
      .query(
        "select * from FINREPORT_ITEMS " +
          " WHERE REPORT_ID= @input_parameter " +
          " ORDER BY PARENT_ITEM_ID, ITEM_SEQ, ITEM_ID"
      );
  })
  .then((result) => {
    console.log("type of result :", typeof result);
    //console.dir(result);
    console.log("rowsAffected:", result.rowsAffected[0]);
    console.log("result.recordsets.length:", result.recordsets.length); // count of recordsets returned by the procedure
    console.log("result.recordsets[0].length:", result.recordsets[0].length); // count of rows contained in first recordset
    //console.log("result.recordset:", result.recordset); // first recordset from result.recordsets
    console.log("result.returnValue:", result.returnValue); // procedure return value
    console.log("result.output:", result.output); // key/value collection of output values
    console.log("result.rowsAffected:", result.rowsAffected); // array of numbers, each number represents the number of rows affected by executed statemens

    result.recordset.forEach((item, index) => {
      console.log(
        "item:",
        index,
        item.PARENT_ITEM_ID,
        item.ITEM_ID,
        item.ITEM_NAME
      );
      if (index < 2) {
        console.log(
          "item types ITEM_ID:",
          item.PARENT_ITEM_ID,
          item.ITEM_ID,
          typeof item.ITEM_ID
        );
        console.log(
          "item types PARENT_ITEM_ID:",
          item.PARENT_ITEM_ID,
          typeof item.PARENT_ITEM_ID
        );
        console.log(
          "item types ITEM_SEQ:",
          item.ITEM_SEQ,
          typeof item.ITEM_SEQ
        );
        console.log(
          "item types ITEM_NAME:",
          item.ITEM_NAME,
          typeof item.ITEM_NAME
        );
        console.log(
          "item types ACCT_ITEM_ID:",
          item.ACCT_ITEM_ID,
          typeof item.ACCT_ITEM_ID
        );
      }
    });
    //for (let i in result.recordset) {
    //  console.log("item:", i, result.recordset[i].ITEM_NAME);
    //}
  })
  .catch((err) => {
    console.error("Error in SQL", err);
  });
