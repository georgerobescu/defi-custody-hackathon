const RecoveryLogic = artifacts.require("./RecoveryLogic.sol");
const Migrations = artifacts.require("./Migrations.sol");
const { BN } = web3.utils;

module.exports = async deployer => {
  await deployer.deploy(RecoveryLogic);
  const instance = await RecoveryLogic.deployed();
  const accounts = await web3.eth.getAccounts();
  const admin = accounts[0];
  const assetAddress = accounts[3];
  const CHILD_WALLETS_AMOUNT = 4;
  const childWallets = accounts.slice(accounts.length - CHILD_WALLETS_AMOUNT);
  const assetPercentage = Array(CHILD_WALLETS_AMOUNT).fill(
    web3.utils.toWei(100 / CHILD_WALLETS_AMOUNT + "0", "milli")
  );
  const deadline = new BN(100);
  const gas = 6500000;

  console.log(instance.methods);
  await instance.setRecoverySheet(
    assetAddress,
    childWallets,
    assetPercentage,
    deadline.toNumber(),
    { from: admin, gas }
  );
};
