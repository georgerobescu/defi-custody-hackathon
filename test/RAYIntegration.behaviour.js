const { BN } = web3.utils;
const { expectRevert } = require("openzeppelin-test-helpers");

// RAY
const RAYUtils = require('./helpers/RAYUtils.js');
const Coins = require('./helpers/Coins.js');
const Constants = require('./helpers/constants.js');
const Deployed = Constants.TEST_ADDRESSES;
const DaiPortfolioIds = Constants.PORTFOLIO_IDS.DAI;


const RAYIntegrationTestSuite = async (accounts, dependencies) => {
  const watchtower = accounts[1];
  const user1 = accounts[2];
  const gas = 6500000;
  let rayTokenId;

  describe("mint()", () => {
    it("should mint one RAY - value of 1 DAI - in DAI Bzx/Compound/Dydx Portfolio", async () => {
      let value = '1';

      await Coins.getDAI(user1, value);
      await Coins.approveDAI(dependencies.rayIntegration.address, user1, value);

      let tx = await dependencies.rayIntegration.methods.mint(
        DaiPortfolioIds.BZX_COMPOUND_DYDX,
        user1,
        web3.utils.toWei(value, 'ether')
      ).send({ from: watchtower, value: 0, gas: 900000 });

      rayTokenId = tx.events.InvestmentRAY.returnValues.rayTokenId;

      let [
        tokenValue,
        tokenOwner
      ] =
      await Promise.all([
        RAYUtils.getRAYTokenValue(DaiPortfolioIds.BZX_COMPOUND_DYDX, rayTokenId),
        dependencies.rayIntegration.methods.getTokenOwner(rayTokenId).call()
      ]);

      assert.notEqual(rayTokenId, Constants.NULL_BYTES, "rayTokenId cannot be null bytes");
      assert.equal(tokenValue, web3.utils.toWei(value, 'ether'), "Token value is incorrect");
      assert.equal(tokenOwner, user1, "Owner is incorrect");
    });
  });

  describe("deposit()", () => {

  });

  describe("redeem()", () => {

  });
  
  describe("redeemAndWithdraw()", () => {
    it("should withdraw 1 DAI from DAI RAY token", async () => {

      let value = web3.utils.toWei('1', 'ether');
      let daiBalanceBefore = await Coins.getDAIBalance(user1);

      let tx = await dependencies.rayIntegration.methods.redeemAndWithdraw(
        rayTokenId,
        value,
        user1
      ).send({ from: user1, value: 0, gas: 900000 });

      let daiBalanceAfter = await Coins.getDAIBalance(user1);

      assert.equal(daiBalanceAfter.toString(), (new BN(value)).add(daiBalanceBefore).toString());

      // expect(daiBalanceAfter.toString()).to.be.bignumber.equal((new BigNumber(value)).plus(daiBalanceBefore));

    });
  });

  describe("verifyValue()", () => {

  });

  describe("transferFunds()", () => {

  });
}

module.exports = {
  RAYIntegrationTestSuite
};
