const RecoveryLogicTest = async (accounts, dependencies) =>
  contract("RecoveryLogic", async () => {
    const admin = accounts[1];
    const owner = accounts[2];
    const gas = 6500000;
    let recoveryLogicInstance;

    before(async () => {
      recoveryLogicInstance = dependencies.recoveryLogicInstance;
    });

    it("should deploy RecoveryLogic", async () => {
      assert(web3.utils.isAddress(recoveryLogicInstance.options.address), "Contract wasn't deployed")
    });
  });

module.exports = {
  RecoveryLogicTest
};
