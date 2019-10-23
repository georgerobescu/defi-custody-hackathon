const { expectRevert } = require("openzeppelin-test-helpers");
const { BN } = web3.utils;
const SupportERC20Tests = async (accounts, dependencies) => {
  const admin = accounts[1];
  const user = accounts[2];
  const thirdPartyWallet = accounts[3];
  const gas = 6500000;
  let supportERC20Instance, ERC20Instance, wallet;

  before(async () => {
    supportERC20Instance = dependencies.supportERC20Instance;
    wallet = supportERC20Instance.options.address;
    ERC20Instance = dependencies.ERC20Instance;
  });

  it("should deploy SupportERC20", async () => {
    assert(
      web3.utils.isAddress(supportERC20Instance.options.address),
      "Contract wasn't deployed"
    );
  });

  it("should deposit tokens to wallet", async () => {
    const amount = new BN(web3.utils.toWei("1", "milli"));
    const userBalanceBefore = new BN(
      await ERC20Instance.methods.balanceOf(user).call()
    );
    const walletBalanceBefore = new BN(
      await ERC20Instance.methods.balanceOf(wallet).call()
    );
    await ERC20Instance.methods
      .transfer(wallet, amount.toString())
      .send({ from: user, gas });
    const userBalanceAfter = await ERC20Instance.methods.balanceOf(user).call();
    const walletBalanceAfter = await ERC20Instance.methods
      .balanceOf(wallet)
      .call();
    assert.strictEqual(
      userBalanceAfter,
      userBalanceBefore.sub(amount).toString(),
      "Incorrect sender balance"
    );
    assert.strictEqual(
      walletBalanceAfter,
      walletBalanceBefore.add(amount).toString(),
      "Incorrect receiver balance"
    );
  });

  it("should withdraw tokens from wallet", async () => {
    const amount = new BN(web3.utils.toWei("1", "milli"));
    const userBalanceBefore = new BN(
      await ERC20Instance.methods.balanceOf(user).call()
    );
    const walletBalanceBefore = new BN(
      await ERC20Instance.methods.balanceOf(wallet).call()
    );
    await supportERC20Instance.methods
      .transfer(user, amount.toString())
      .send({ from: admin, gas });
    const userBalanceAfter = await ERC20Instance.methods.balanceOf(user).call();
    const walletBalanceAfter = await ERC20Instance.methods
      .balanceOf(wallet)
      .call();
    assert.strictEqual(
      userBalanceAfter,
      userBalanceBefore.add(amount).toString(),
      "Incorrect sender balance"
    );
    assert.strictEqual(
      walletBalanceAfter,
      walletBalanceBefore.sub(amount).toString(),
      "Incorrect receiver balance"
    );
  });

  it("should approve token transfer from wallet to third party wallet", async () => {
    const amount = web3.utils.toWei("1", "milli");
    await supportERC20Instance.methods
      .approve(thirdPartyWallet, amount)
      .send({ from: admin, gas });
    const allowance = await ERC20Instance.methods
      .allowance(wallet, thirdPartyWallet)
      .call();
    assert.strictEqual(
      allowance,
      amount,
      "Allowance amount is not the same as was approved."
    );
  });

  it("should set new ERC20 token", async () => {
    const mockedContractAddress = supportERC20Instance.options.address;
    await supportERC20Instance.methods
      .setERC20(mockedContractAddress)
      .send({ from: admin });
    const addressAfter = await supportERC20Instance.methods.erc20().call();
    assert.strictEqual(
      addressAfter,
      mockedContractAddress,
      "ERC20 address wasn't change"
    );
  });

  it("should throw error if was set non contract address", async () => {
    await expectRevert(
      supportERC20Instance.methods
        .setERC20(thirdPartyWallet)
        .send({ from: admin }),
      "Cannot set a ERC20 implementation to a non-contract address"
    );
  });
};

module.exports = {
  SupportERC20Tests
};
