const RecoveryLogicTest = async (accounts, dependencies) =>
  describe("RecoveryLogic", async () => {
    const admin = accounts[1];
    const owner = accounts[2];
    const assetAddress = accounts[3];
    const childWallets = accounts.slice(3, 3);
    const assetValues = childWallets.map((wallet, i) => i);
    const gas = 6500000;
    const deadline = 100;
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
      const deadlineBefore= await recoveryLogicInstance.methods
        .recoveryDeadline()
        .call({ from: owner });
      await recoveryLogicInstance.methods
        .setRecoverySheet(assetAddress, childWallets, assetValues, deadline)
        .send({ from: admin, gas });
      const deadlineAfter = await recoveryLogicInstance.methods
        .recoveryDeadline()
        .call({ from: owner });
      console.log(deadlineBefore, deadlineAfter);
    });
  });

module.exports = {
  RecoveryLogicTest
};
