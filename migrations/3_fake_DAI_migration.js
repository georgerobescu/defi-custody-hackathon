const MockedERC20 = artifacts.require("./MockedERC20.sol");
const DeFiCustodyRegistry = artifacts.require("./DeFiCustodyRegistry.sol");

module.exports = async (deployer, network, accounts) => {
  await deployer.deploy(MockedERC20);
  const DeFiCustodyRegistryInstance = await DeFiCustodyRegistry.deployed();
  const mockedERC20Instance = await MockedERC20.deployed();
  await DeFiCustodyRegistryInstance.addSupportedToken(
    mockedERC20Instance.address,
    { from: accounts[0] }
  );
};
