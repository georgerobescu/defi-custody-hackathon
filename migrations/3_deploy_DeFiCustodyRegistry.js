const DeFiCustodyRegistry = artifacts.require("DeFiCustodyRegistry.sol");

module.exports = async (deployer, network, accounts) => {
  await deployer.deploy(DeFiCustodyRegistry);
  let dc = await DeFiCustodyRegistry.deployed();
  await dc.init("0x8734b14327c94A8252cDb40DBE44a628d38CEBe2", accounts[0]);
};
