const { expectRevert } = require("openzeppelin-test-helpers");
const { BN } = web3.utils;

const DCWalletTestSuite = async (accounts, dependencies) => {
  const admin = accounts[1];
  const user = accounts[2];
  const thirdPartyWallet = accounts[3];
  const gas = 6500000;
  let ERC20Instance, dcWallet;

  before(async () => {
    dcWallet = dependencies.dcWallet;
    ERC20Instance = dependencies.ERC20Instance;
  });

  describe("depositDC()", () => {
    it("should deposit tokens to wallet", async () => {
      const wallet = dcWallet.options.address;
      const amount = new BN(web3.utils.toWei("1", "milli"));
      const userBalanceBefore = new BN(
        await ERC20Instance.methods.balanceOf(user).call()
      );
      const walletBalanceBefore = new BN(
        await ERC20Instance.methods.balanceOf(wallet).call()
      );
      await ERC20Instance.methods
        .approve(wallet, amount.toString())
        .send({ from: user, gas });
      await dcWallet.methods
        .depositDC(ERC20Instance.options.address, user, amount.toString())
        .send({ from: admin, gas });
      const userBalanceAfter = await ERC20Instance.methods
        .balanceOf(user)
        .call();
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
  });

  describe("withdrawDC()", () => {
    it("should withdraw tokens from wallet", async () => {
      const wallet = dcWallet.options.address;
      const amount = new BN(web3.utils.toWei("1", "milli"));
      const userBalanceBefore = new BN(
        await ERC20Instance.methods.balanceOf(user).call()
      );
      const walletBalanceBefore = new BN(
        await ERC20Instance.methods.balanceOf(wallet).call()
      );
      await dcWallet.methods
        .withdrawDC(ERC20Instance.options.address, amount.toString())
        .send({ from: user, gas });
      const userBalanceAfter = await ERC20Instance.methods
        .balanceOf(user)
        .call();
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
  });
};

module.exports = {
  DCWalletTestSuite
};
