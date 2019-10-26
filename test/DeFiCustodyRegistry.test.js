const { TestHelper } = require("@openzeppelin/cli");
const { Contracts, ZWeb3 } = require("@openzeppelin/upgrades");
/* Initialize OpenZeppelin's Web3 provider. */
ZWeb3.initialize(web3.currentProvider);

/* Retrieve compiled contract artifacts. */
const DeFiCustodyRegistry = Contracts.getFromLocal("DeFiCustodyRegistry");
const ERC20 = artifacts.require("./MockedERC20.sol");

const { expectRevert } = require("openzeppelin-test-helpers");

// RAY
const RAYUtils = require('./helpers/RAYUtils.js');
const Coins = require('./helpers/Coins.js');
const Constants = require('./helpers/constants.js');
const Deployed = Constants.TEST_ADDRESSES;
const DaiPortfolioIds = Constants.PORTFOLIO_IDS.DAI;


contract("DeFiCustodyRegistry", async accounts => {

  let project;
  const admin = accounts[1];
  const owner = accounts[2];
  const user1 = accounts[3];
  const nonOwner = accounts[4];
  const gas = 6000000;
  const rayStorage = Deployed.STORAGE;
  let deFiCustodyRegistryInstance, erc20Instance;

  before(async () => {
    project = await TestHelper({ from: admin });
    deFiCustodyRegistryInstance = await project.createProxy(
      DeFiCustodyRegistry,
      {
        initMethod: "init",
        initArgs: [rayStorage, owner]
      }
    );

    erc20Instance = await ERC20.new({ from: admin })
  });

  describe("init()", () => {
    it("should have correct owner");
  })

  describe("addSupportedToken()", () => {
    it("should add token", async () => {
      await deFiCustodyRegistryInstance.methods
        .addSupportedToken(erc20Instance.address)
        .send({ from: owner, gas });
      const tokens = await deFiCustodyRegistryInstance.methods.getTokens().call();
      assert(tokens.length === 1, "Token wasn't add to smart contract");
      assert.strictEqual(erc20Instance.address, tokens[0], "Wrong address.");
    });

    it("shouldn't add same token", async () => {
      await expectRevert(
        deFiCustodyRegistryInstance.methods
          .addSupportedToken(erc20Instance.address)
          .send({ from: owner, gas }),
        "Token was already added."
      );
    });

    it("should throw error if adding token from non owner account", async () => {
      await expectRevert(
        deFiCustodyRegistryInstance.methods
          .addSupportedToken(erc20Instance.address)
          .send({ from: nonOwner }),
        "Ownable: caller is not the owner"
      );
    });
  });

  describe("recoverRAY()", () => {
    it("should recover funds");
  });
});
