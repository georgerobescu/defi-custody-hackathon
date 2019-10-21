const  {BN} = web3.utils;
const RecoveryLogicTest = async (accounts, dependencies) =>
  describe("RecoveryLogic", async () => {
    const admin = accounts[1];
    const owner = accounts[2];
    const assetAddress = accounts[3];
    const childWallets = accounts.slice(6);
    const assetPercentage = childWallets.map((wallet, i) => i + 1);
    const gas = 6500000;
    const deadline = new BN(100);
    let recoveryLogicInstance;

    before(async () => {
      recoveryLogicInstance = dependencies.recoveryLogicInstance;
    });

    it("should deploy RecoveryLogic", async () => {
      assert(
        web3.utils.isAddress(recoveryLogicInstance.options.address),
        "Contract wasn't deployed"
      );
    });

    it("should set recovery sheet", async () => {
      const deadlineBefore = await recoveryLogicInstance.methods
        .recoveryDeadline()
        .call();
      await recoveryLogicInstance.methods
        .setRecoverySheet(assetAddress, childWallets, assetPercentage, deadline.toNumber())
        .send({ from: admin, gas });
      const firstChildPercentage = await recoveryLogicInstance.methods
      .recoverySheet(childWallets[0], assetAddress)
      .call();
      const deadlineAfter = await recoveryLogicInstance.methods
        .recoveryDeadline()
        .call({ from: owner });
      const recoveryWallets = await recoveryLogicInstance.methods
        .getRecoveryWallets()
        .call();
      assert.equal(
          firstChildPercentage,
          assetPercentage[0],
          "Percentage hasn't been changed."
      )
      assert.equal(
          deadlineAfter,
          (new BN(deadlineBefore)).add(deadline).toString(),
          "Deadline hasn't been changed."
      )
      assert.deepEqual(
          recoveryWallets,
          childWallets,
          "Recovery wallets haven't been changed."
      )

    });
  });

module.exports = {
  RecoveryLogicTest
};
