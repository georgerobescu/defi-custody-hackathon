const { TestHelper } = require("@openzeppelin/cli");
const { Contracts, ZWeb3 } = require("@openzeppelin/upgrades");
/* Initialize OpenZeppelin's Web3 provider. */
ZWeb3.initialize(web3.currentProvider);

/* Retrieve compiled contract artifacts. */
const RecoveryLogic = Contracts.getFromLocal("RecoveryLogic");

const { RecoveryLogicTestSuite } = require("./RecoveryLogic.behaviour.js");

contract("RecoveryLogic", async accounts => {
  const dependencies = {};
  const admin = accounts[1];
  const gas = 6500000;

  before(async () => {
    project = await TestHelper({ from: admin });
    dependencies.recoveryLogicInstance = await project.createProxy(
      RecoveryLogic,
      {
        initMethod: "init",
        initArgs: [admin]
      }
    );
  });

  await RecoveryLogicTestSuite(accounts, dependencies);
});
