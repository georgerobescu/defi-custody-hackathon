const { TestHelper } = require("@openzeppelin/cli");
const { Contracts, ZWeb3 } = require("@openzeppelin/upgrades");
/* Initialize OpenZeppelin's Web3 provider. */
ZWeb3.initialize(web3.currentProvider);

/* Retrieve compiled contract artifacts. */
const RAYIntegration = Contracts.getFromLocal("RAYIntegration");

const { RAYIntegrationTestSuite } = require("./RAYIntegration.behaviour.js");
const Constants = require("./helpers/constants.js");
const Deployed = Constants.TEST_ADDRESSES;

contract("RAYIntegration", async accounts => {
  const dependencies = {};
  const admin = accounts[0];
  const rayStorage = Deployed.STORAGE;

  before(async () => {
    project = await TestHelper({ from: admin });
    dependencies.rayIntegration = await project.createProxy(RAYIntegration, {
      initMethod: "init",
      initArgs: [rayStorage]
    });
  });

  await RAYIntegrationTestSuite(accounts, dependencies);
});
