const { TestHelper } = require("@openzeppelin/cli");
const { Contracts, ZWeb3 } = require("@openzeppelin/upgrades");
const { RecoveryLogicTest } = require("./RecoveryLogic.test");
/* Initialize OpenZeppelin's Web3 provider. */
ZWeb3.initialize(web3.currentProvider);

/* Retrieve compiled contract artifacts. */
const DeFiCustodyRegistry = Contracts.getFromLocal("DeFiCustodyRegistry");
const RecoveryLogic = Contracts.getFromLocal("RecoveryLogic");

// TODO: remove after Wallet implementation is developed
const Migrations = artifacts.require("./Migrations.sol");

const { expectRevert } = require("openzeppelin-test-helpers");

contract("DeFiCustodyRegistry", async accounts => {
  let project;
  const admin = accounts[1];
  const owner = accounts[2];
  const tokenAddress = accounts[3];
  const adminAddress = accounts[4];
  const nonOwner = accounts[5];
  const roleName = "owner";
  const emptyData = "0x";
  const gas = 6500000;
  let deFiCustodyRegistryInstance;
  const dependencies = {};

  before(async () => {
    project = await TestHelper({ from: admin });
    // TODO: replace tempForAddress with Wallet implementation after it's developed
    const tempForAddress = await Migrations.new();
    deFiCustodyRegistryInstance = await project.createProxy(
      DeFiCustodyRegistry,
      {
        initMethod: "init",
        initArgs: [owner, tempForAddress.address]
      }
    );
    dependencies.recoveryLogicInstance = await RecoveryLogic.deploy({
      data: RecoveryLogic.schema.bytecode
    }).send({ from: admin, gas });
  });

  it("should deploy DeFiCustodyRegistry", async () => {
    const name = await deFiCustodyRegistryInstance.methods
      .OWNER()
      .call({ from: owner });
    assert.strictEqual(
      name,
      roleName,
      "DeFiCustodyRegistry contract wasn't deployed!"
    );
  });

  it("should add main account as owner", async () => {
    const result = await deFiCustodyRegistryInstance.methods
      .hasRole(owner, roleName)
      .call({ from: owner });
    assert.strictEqual(result, true, "Main account is not owner.");
  });

  it("should add token", async () => {
    await deFiCustodyRegistryInstance.methods
      .addSupportedToken(tokenAddress)
      .send({ from: owner, gas });
    const tokens = await deFiCustodyRegistryInstance.methods.getTokens().call();
    assert(tokens.length === 1, "Token wasn't add to smart contract");
    assert.strictEqual(tokenAddress, tokens[0], "Wrong address.");
  });

  it("shouldn't add same token", async () => {
    await expectRevert(
      deFiCustodyRegistryInstance.methods
        .addSupportedToken(tokenAddress)
        .send({ from: owner, gas }),
      "Token was already added."
    );
  });

  it("should deploy new wallet", async () => {
    const receipt = await deFiCustodyRegistryInstance.methods
      .createWalletProxy(adminAddress, emptyData)
      .send({ from: owner, gas });
    const walletAddress = receipt.events.NewWallet.returnValues.proxy;
    const wallets = await deFiCustodyRegistryInstance.methods
      .getWallets()
      .call();
    assert(wallets.length === 1, "Wallet wasn't add to smart contract");
    assert.strictEqual(wallets[0], walletAddress, "Wrong address");
  });

  it("should throw error if adding token from non owner account", async () => {
    await expectRevert(
      deFiCustodyRegistryInstance.methods
        .addSupportedToken(tokenAddress)
        .send({ from: nonOwner }),
      "Forbidden"
    );
  });

  await RecoveryLogicTest(accounts, dependencies);
});
