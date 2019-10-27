const { getRayContract } = require("../utils/contracts");
const customWeb3 = require("../ethereum/web3");
const express = require("express");
const router = express.Router();

router.post("/invest", async (req, res, next) => {
  const { portfolioId, payableBeneficiary, value } = req.body;

  if (
    !value ||
    !portfolioId ||
    !payableBeneficiary ||
    parseInt(value) <= 0 ||
    portfolioId === "" ||
    !customWeb3.getWeb3().utils.isAddress(payableBeneficiary)
  ) {
    console.error("params: ", portfolioId, payableBeneficiary, value);
    return res.status(400).json({ error: "Bad params" });
  }

  // mint(bytes32 portfolioId, address payable beneficiary, uint value)
  try {
    const rayContractInstance = await getRayContract();

    const transaction = rayContractInstance.methods.mint(
      portfolioId,
      payableBeneficiary,
      value
    );
    console.log(
      "Sending mint transaction for rayContractInstance with params:",
      portfolioId,
      payableBeneficiary,
      value
    );
    const result = await customWeb3.sendFromMain(transaction);
    res.json(result);
  } catch (error) {
    console.error("error=" + error);
    console.log(error.stack);
    res.status(500).json({ error: "Error sending message to Ray" });
  }
});

module.exports = router;