const { getRecoveryLogic } = require("../utils/contracts");
const customWeb3 = require("../ethereum/web3");
const { sleep } = require("../../test/utils/utils.js");
let time = 2000;
process.on('unhandledRejection', () => {});

const recoveryFunc = async function () {
  console.log("### Starting recovery process ###")
  await sleep(time);
  const recoveryLogicInstance = await getRecoveryLogic();

  const wallets = await recoveryLogicInstance.methods
    .getDCWallets()
    .call();
  console.log("# wallets to recover " + wallets, '\n')
  await sleep(time);
  await wallets.forEach(async (wallet) => {
    console.log(" - checking wallet " + wallet);
    await sleep(time);
    const isRecoverable = await recoveryLogicInstance.methods
      .isRecoverable(wallet)
      .call();
    if (isRecoverable) {
      const rayTokens = await recoveryLogicInstance.methods
        .getRayTokens(wallet)
        .call();
      console.log("# Wallet ", wallet, " is in recoverable state.", rayTokens.length, " positions to recover.", '\n');
      await sleep(time);
      await rayTokens.forEach(async (tokenId, index) => {
        const value = await recoveryLogicInstance.methods
          .getTokenValue(tokenId)
          .call();
        if (value > 0) {
          const transaction = await recoveryLogicInstance.methods
            .recoverRAY(tokenId);
          let result = await customWeb3.sendFromMain(transaction);
          console.log(`### Position ${index}, value of ${value} DAI, recovered for wallet ${wallet}! ###`, '\n');  
          await sleep(time);
        } else {
          console.log("# Position ", index + "'s value 0, nothing to recover.");
          await sleep(time);
        }
      })
    } else {
      console.log("wallet " + wallet + " is still not recoverable");
      await sleep(time);
    }
  })
  // console.log("### Process finished ###")
}

module.exports = { recoveryFunc };