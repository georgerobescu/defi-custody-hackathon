const { TestHelper } = require("@openzeppelin/cli");
const { Contracts, ZWeb3 } = require("@openzeppelin/upgrades");
/* Initialize OpenZeppelin's Web3 provider. */
ZWeb3.initialize(web3.currentProvider);

/* Retrieve compiled contract artifacts. */
const DeFiCustodyRegistry = Contracts.getFromLocal("DeFiCustodyRegistry");
const ERC20 = artifacts.require("./MockedERC20.sol");

const { expectRevert } = require("openzeppelin-test-helpers");
const { sleep } = require("./utils/utils.js");
const { BN } = web3.utils;

// RAY
const RAYUtils = require("./helpers/RAYUtils.js");
const Coins = require("./helpers/Coins.js");
const Constants = require("./helpers/constants.js");
const Deployed = Constants.TEST_ADDRESSES;
const DaiPortfolioIds = Constants.PORTFOLIO_IDS.DAI;

contract("DeFiCustodyRegistry", async accounts => {
  let project;
  const watchtower = accounts[0];
  const admin = accounts[1];
  const owner = accounts[2];
  const user1 = accounts[3];
  const nonOwner = accounts[4];
  const recoveryWallets = [accounts[5], accounts[6]];
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

    erc20Instance = await ERC20.new({ from: admin });
  });

  describe("init()", () => {
    it("should have correct owner");
  });

  describe("addSupportedToken()", () => {
    it("should add token", async () => {
      await deFiCustodyRegistryInstance.methods
        .addSupportedToken(erc20Instance.address)
        .send({ from: owner, gas });
      const tokens = await deFiCustodyRegistryInstance.methods
        .getTokens()
        .call();
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
    it("should recover funds", async () => {
      // invest 1 DAI
      let value = '1';
      await Coins.getDAI(user1, value);
      await Coins.approveDAI(deFiCustodyRegistryInstance.address, user1, value);

      let tx = await deFiCustodyRegistryInstance.methods.mint(
        DaiPortfolioIds.BZX_COMPOUND_DYDX,
        user1,
        web3.utils.toWei(value, 'ether')
      ).send({ from: watchtower, value: 0, gas: 900000 });

      rayTokenId = tx.events.InvestmentRAY.returnValues.rayTokenId;

      let [
        tokenValue,
        tokenOwner
      ] =
      await Promise.all([
        RAYUtils.getRAYTokenValue(DaiPortfolioIds.BZX_COMPOUND_DYDX, rayTokenId),
        deFiCustodyRegistryInstance.methods.getTokenOwner(rayTokenId).call()
      ]);

      assert.notEqual(rayTokenId, Constants.NULL_BYTES, "rayTokenId cannot be null bytes");
      assert.equal(tokenValue, web3.utils.toWei(value, 'ether'), "Token value is incorrect");
      assert.equal(tokenOwner, user1, "Owner is incorrect");


      // setup recovery sheet
      const deadlineBefore = await deFiCustodyRegistryInstance.methods
        .recoveryDeadline(user1)
        .call();

      const assetPercentage = [web3.utils.toWei("0.5", "ether"), web3.utils.toWei("0.5", "ether")];
      const deadline = 1; //2 seconds

      await deFiCustodyRegistryInstance.methods
        .setRecoverySheet(
          Deployed.DAI_TOKEN,
          recoveryWallets,
          assetPercentage,
          deadline
        ).send({ from: user1, gas });

      const firstWalletPercentage = await deFiCustodyRegistryInstance.methods
        .recoverySheet(user1, recoveryWallets[0], Deployed.DAI_TOKEN)
        .call();
      const deadlineAfter = await deFiCustodyRegistryInstance.methods
        .recoveryDeadline(user1)
        .call({ from: owner });
      const recoveryWalletsContract = await deFiCustodyRegistryInstance.methods
        .getRecoveryWallets(user1)
        .call({ from: owner });

      assert.equal(firstWalletPercentage, assetPercentage[0], "firstWalletPercentage hasn't changed."
      );
      assert.equal(deadlineAfter, deadline, "Deadline hasn't changed.");
      assert.deepEqual(recoveryWalletsContract, recoveryWallets, "Recovery wallets haven't been changed.");

      await sleep(1000);

      assert(await deFiCustodyRegistryInstance.methods.isRecoverable(user1).call(), "Should be recoverable");

      let recoveryWallets0Before = new BN(await Coins.getDAIBalance(recoveryWallets[0]));
      let recoveryWallets1Before = new BN(await Coins.getDAIBalance(recoveryWallets[1]));

      let tokens = await deFiCustodyRegistryInstance.methods.getRayTokens(user1).call();
      let recoveryTx = await deFiCustodyRegistryInstance.methods.recoverRAY(tokens[0]).send({from: watchtower, gas: 900000});

      let recoveryWallets0After = new BN(await Coins.getDAIBalance(recoveryWallets[0]));
      let recoveryWallets1After = new BN(await Coins.getDAIBalance(recoveryWallets[1]));

      let recoveryValue = new BN(tokenValue).div(new BN(2));

      let expectedBal0 = recoveryWallets0Before.add(recoveryValue);
      let expectedBal1 = recoveryWallets1Before.add(recoveryValue);

      assert.equal(expectedBal0.toString(), recoveryWallets0After.toString(), "Balance for recoveryWallets0 incorrect");
      assert.equal(expectedBal1.toString(), recoveryWallets1After.toString(), "Balance for recoveryWallets1 incorrect");
      // TODO: check events
    });
  });
});
