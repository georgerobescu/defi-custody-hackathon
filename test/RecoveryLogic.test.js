var RecoveryLogic = artifacts.require("./RecoveryLogic.sol");
const { RecoveryLogicTest } = require("./RecoveryLogic.behaviour.js");

contract("RecoveryLogic", async accounts => {
  const dependencies = {};
  const admin = accounts[1];
  const gas = 6500000;

  before(async () => {
    let recoveryLogicInstance = await RecoveryLogic.new({from: admin});
    dependencies.recoveryLogicInstance = new web3.eth.Contract(
      recoveryLogicInstance.abi,
      recoveryLogicInstance.address,
      {from: admin}
    );
  });

  await RecoveryLogicTest(accounts, dependencies);
});
