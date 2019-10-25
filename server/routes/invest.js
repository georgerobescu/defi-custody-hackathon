const { getDCContract, getRegistryContract } = require("../utils/contracts");
const customWeb3 = require("../ethereum/web3");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res, next) => {
  const dcContractInstance = await getDCContract();

  const wallets = await registryInstance.methods.getWallets().call();
  const transaction = registryInstance.methods.init(
    registryInstance.options.address,
    registryInstance.options.address
  );
  const receipt = await customWeb3.sendFromMain(transaction);
  res.json({ wallets, receipt });
});

router.get("/invest", async (req, res, next) => {
  const registryInstance = await getRegistryContract();
  const wallets = await registryInstance.methods.getWallets().call();
  res.json({ wallets });
});

module.exports = router;
