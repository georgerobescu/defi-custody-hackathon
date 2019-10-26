const createError = require("http-errors");
const express = require("express");
const logger = require("morgan");
const customWeb3 = require("./ethereum/web3");
const depositRouter = require("./routes/invest");
const { redeemRouter, recoveryFunc } = require("./routes/redeem");
const cron = require("node-cron");

customWeb3.initAccount();
const app = express();
//TODO set logger var
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/v1", depositRouter);

app.use(async (req, res, next) => {
  next(createError(404));
});

cron.schedule("* * * * *", function () {
  console.log("running cron job")
  recoveryFunc();
});

// error handler
app.use(async (err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json("error");
});

module.exports = app;
