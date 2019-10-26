const { TestHelper } = require("@openzeppelin/cli");
const { Contracts, ZWeb3 } = require("@openzeppelin/upgrades");
/* Initialize OpenZeppelin's Web3 provider. */
ZWeb3.initialize(web3.currentProvider);

/* Retrieve compiled contract artifacts. */
const DCWallet = Contracts.getFromLocal("DCWallet");

const ERC20 = artifacts.require("./MockedERC20.sol");
const { DCWalletTestSuite } = require("./DCWallet.behaviour");

contract("DCWallet", async accounts => {
  let project;
  const admin = accounts[1];
  const user = accounts[2];
  const gas = 6500000;
  const dependencies = {};

  before(async () => {
    project = await TestHelper({ from: admin });
    dependencies.dcWallet = await project.createProxy(
      DCWallet
    );

    const ERC20Instance = await ERC20.new({ from: user });
    dependencies.ERC20Instance = new web3.eth.Contract(
      ERC20Instance.abi,
      ERC20Instance.address,
      { from: user }
    );
  });

  await DCWalletTestSuite(accounts, dependencies);
});
