const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("index", { title: "title", bodyContent: "Hello world!" });
});

module.exports = router;
