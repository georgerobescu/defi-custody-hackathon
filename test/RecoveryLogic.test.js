const { Contracts, ZWeb3 } = require("@openzeppelin/upgrades");
/* Initialize OpenZeppelin's Web3 provider. */

ZWeb3.initialize(web3.currentProvider);

const { RecoveryLogicTest } = require("./RecoveryLogic.behaviour");

const RecoveryLogic = Contracts.getFromLocal("RecoveryLogic");

contract("RecoveryLogic", async accounts => {
  const dependencies = {};
  const admin = accounts[1];
  const gas = 6500000;

  before(async () => {
    dependencies.recoveryLogicInstance = await RecoveryLogic.deploy({
      data: RecoveryLogic.schema.bytecode
    }).send({ from: admin, gas });
  });

  await RecoveryLogicTest(accounts, dependencies);
});
