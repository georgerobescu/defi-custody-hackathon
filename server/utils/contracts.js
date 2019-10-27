const registryContractName = { name: "DeFiCustodyRegistry" };
//TODO UPDATE
const customWeb3 = require("../ethereum/web3");

const getRegistryContract = async () =>
  findInstance(registryContractName, await customWeb3.getWeb3());

const getRecoveryLogic = async () =>
  findInstance(registryContractName, await customWeb3.getWeb3());

const getRayContract = async () =>
  findInstance(registryContractName, await customWeb3.getWeb3());

const findInstance = async (contract, web3) => {
  console.log("Find instance of ", contract.name);
  if (!contract.instance) {
    const contractJSON = require(`../../build/contracts/${contract.name}`);
    const networkId =
      process.env.NODE_ENV === "prod"
        ? "42"
        : Object.keys(contractJSON.networks)[
            Object.keys(contractJSON.networks).length - 1
          ];
    const address = contractJSON.networks[networkId].address;
    contract.instance = await new web3.eth.Contract(contractJSON.abi, address);
  }
  console.log(
    "Instance of ",
    contract.name,
    " found ",
    contract.instance.options.address
  );
  return contract.instance;
};

module.exports = {
  getRegistryContract,
  getRecoveryLogic,
  getRayContract
};
