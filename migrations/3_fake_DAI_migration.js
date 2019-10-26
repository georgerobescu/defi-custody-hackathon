const MockedERC20 = artifacts.require("./MockedERC20.sol");

module.exports = async deployer => {
  await deployer.deploy(MockedERC20);
};
