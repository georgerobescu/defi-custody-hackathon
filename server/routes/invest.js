const { getDCContract, getRegistryContract } = require("../utils/contracts");
const customWeb3 = require("../ethereum/web3");
const express = require("express");
const router = express.Router();

router.post("/invest", async (req, res, next) => {

  var portfolioId = req.body.portfolioId
  var payableBeneficiary = req.body.payableBeneficiary
  var value = req.body.value

  if (parseInt(value) > 0 || portfolioId == "" || web3.utils.isAddress(customWeb3)) {
    console.error("req=" + req);
    res.status(400).json({ "error": "Bad params" });
  }

  // mint(bytes32 portfolioId, address payable beneficiary, uint value)
  try {
    const rayContractInstance = await getRayContract();

    const transaction = rayContractInstance.methods.mint(
      portfolioId,
      payableBeneficiary,
      value
    );
    await customWeb3.sendFromMain(transaction);
    res.status(201);
  }
  catch (error) {
    console.error("req=" + req);
    console.error("error=" + error);
    res.status(500).json({ "error": "Error sending message to Ray" })
  }
});

module.exports = router;
