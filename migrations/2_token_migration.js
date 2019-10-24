const DeFiCustodyRegistry = artifacts.require("./DeFiCustodyRegistry.sol");

module.exports = async (deployer) => {
  const instance = await deployer.deploy(DeFiCustodyRegistry);
};