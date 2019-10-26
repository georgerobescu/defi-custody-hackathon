const DeFiCustodyRegistry = artifacts.require("./DeFiCustodyRegistry.sol");
// TODO: remove after Wallet implementation is developed
const Migrations = artifacts.require("./Migrations.sol");

module.exports = async deployer => {
  await deployer.deploy(DeFiCustodyRegistry);
  // const instance = await DeFiCustodyRegistry.deployed();
  // const tempForAddress = await Migrations.new();
  // const accounts = await web3.eth.getAccounts();
  // // TODO: replace tempForAddress with Wallet implementation after it's developed
  // await instance.init(accounts[0], tempForAddress.address);
};
