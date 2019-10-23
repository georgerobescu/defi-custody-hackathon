const SupportERC20 = artifacts.require("./SupportERC20.sol");
const ERC20 = artifacts.require("./MockedERC20.sol");
const { SupportERC20Tests } = require("./SupportERC20.behaviour");

contract("SupportERC20", async accounts => {
  const admin = accounts[1];
  const user = accounts[2];
  const gas = 6500000;
  const dependencies = {};

  before(async () => {
    const ERC20Instance = await ERC20.new({ from: user });
    dependencies.ERC20Instance = new web3.eth.Contract(
      ERC20Instance.abi,
      ERC20Instance.address,
      { from: user }
    );
    const supportERC20Instance = await SupportERC20.new(
      dependencies.ERC20Instance.options.address,
      { from: admin }
    );
    dependencies.supportERC20Instance = new web3.eth.Contract(
      supportERC20Instance.abi,
      supportERC20Instance.address,
      { from: admin }
    );
  });

  await SupportERC20Tests(accounts, dependencies);
});
