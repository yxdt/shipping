const express = require("express");
const app = express();
const mongoose = require("mongoose");
const config = require("config");
const sql = require("mssql");

const courses = [
  { id: 1, name: "course 1" },
  { id: 2, name: "course 2" },
  { id: 3, name: "course 3" },
];

const connStr = "mongodb://localhost:27017/?readPreference=primary&ssl=false";

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/courses", (req, res) => {
  res.send([1, 2, 3, 4, 5]);
});
app.get("/api/courses/:id", (req, res) => {
  const course = courses.find((item) => item.id === parseInt(req.params.id));
  if (!course) {
    res.status(404).send("The course with the given id not found.");
  }
  res.send(course);
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

mongoose
  .connect(connStr, { useNewUrlParser: true })
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
