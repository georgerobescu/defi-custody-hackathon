const MockedERC20 = artifacts.require("MockedERC20.sol");

module.exports = async (deployer, network, accounts) => {
  deployer.deploy(MockedERC20, accounts[0], web3.utils.toWec("1", "ether"));
};
