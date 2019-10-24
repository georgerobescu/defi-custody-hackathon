const cron = require("node-cron");
const web3 = require("web3");
const express = require("express");
const Tx = require("ethereumjs-tx");

var RecoveryLogic = artifacts.require("./RecoveryLogic.sol");

app = express();

cron.schedule("* * * * *", function() {
  console.log("Running Cron Job");
});

app.get("/getBalance", function(req, res) {
  const walletAddress = "0x25F5a09845cec7f7Ed17A19ea454B839A6434DDD";
  web3js.eth.getBalance(walletAddress).then(balance => console.log(balance)); //Will give value in.
});

app.listen(3000, () => console.log("Example app listening on port 3000!"));
