const fs = require("fs");
const orders = { name: "DeFiCustodyRegistry" };
const customWeb3 = require("../ethereum/web3");

const getRegistryContract = async () =>
  findInstance(orders, await customWeb3.getWeb3());

const findInstance = async (contract, web3) => {
  if (!contract.instance) {
    const contractJSON = require(`../../build/contracts/${
      contract.name
    }`);
    const networkId =
      process.env.NODE_ENV === "production"
        ? "4"
        : Object.keys(contractJSON.networks)[
            Object.keys(contractJSON.networks).length - 1
          ];
    const address = contractJSON.networks[networkId].address;
    contract.instance = await new web3.eth.Contract(contractJSON.abi, address);
  }
  return contract.instance;
};

module.exports = {
  getRegistryContract
};
