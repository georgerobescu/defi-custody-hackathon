const DeFiCustodyRegistry = artifacts.require("DeFiCustodyRegistry.sol");

module.exports = async (deployer, network, accounts) => {
  let rayStorage;
  console.log(network);
  switch (network) {
    case "development":
      rayStorage = "0x8734b14327c94A8252cDb40DBE44a628d38CEBe2";
      break;
    case "kovan":
    case "kovan-fork":
      rayStorage = "0x39Df6B760C1be5DCD0162E2B0057A963F148B531";
      break;
  }
  console.log(
    `Deploying with\nRay Storage: ${rayStorage}\nOwner address: ${accounts[0]}`
  );
  await deployer.deploy(DeFiCustodyRegistry);
  let dc = await DeFiCustodyRegistry.deployed();
  let tx = await dc.init(rayStorage, accounts[0]);
};
