const { recoveryFunc } = require("../jobs/recovery");
const express = require("express");
const router = express.Router();

router.get("/redeem", async (req, res, next) => {
  try {
    recoveryFunc();
    res.status(200)
  } catch (error) {
    console.log(error)
    res.status(500)
  }
});

module.exports = router;