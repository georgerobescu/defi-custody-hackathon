const { getRecoveryLogic } = require("../utils/contracts");
const customWeb3 = require("../ethereum/web3");
const express = require("express");
const router = express.Router();

router.get("/redeem", async (req, res, next) => {
  //RecoveryFunc()
});

const recoveryFunc = async function () {
  const recoveryLogicInstance = await getRecoveryLogic();

  const isRecoverable = await recoveryLogicInstance.methods
    .isRecoverable()
    .call();
  if (isRecoverable) {
    const transaction = await recoveryLogicInstance.methods
      .recover();
    await customWeb3.sendFromMain(transaction);
    console.log("is recoverable");
  }
  console.log("not recoverable");
}

module.exports = {
  router,
  recoveryFunc
}
