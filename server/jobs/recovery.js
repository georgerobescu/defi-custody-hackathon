const { getRecoveryLogic } = require("../utils/contracts");
const customWeb3 = require("../ethereum/web3");

const recoveryFunc = async function () {
  console.log("starting recovery process")
  const recoveryLogicInstance = await getRecoveryLogic();

  const wallets = await recoveryLogicInstance.methods
    .getDCWallets()
    .call();
  console.log("wallets to recover" + wallets)
  for (const wallet of wallets) {
    console.log("checking wallet" + wallet)
    const isRecoverable = await recoveryLogicInstance.methods
      .isRecoverable(wallet)
      .call();
    if (isRecoverable) {
      console.log("wallet " + wallet + " is in recoverable state");
      const transaction = await recoveryLogicInstance.methods
        .recover(wallet);
      await customWeb3.sendFromMain(transaction);
      console.log("wallet " + wallet + " recovered");
    }
    console.log("wallet " + wallet + " is still not recoverable");
  }
  console.log("process finished")
}

module.exports = recoveryFunc;