const registryContractName = { name: "DeFiCustodyRegistry" };
const recoveryLogicContractName = { name: "RecoveryLogic" };
//TODO UPDATE
const DCContractName = { name: "DCContractName" };
const customWeb3 = require("../ethereum/web3");

const getRegistryContract = async () =>
  findInstance(registryContractName, await customWeb3.getWeb3());

const getDCContract = async () =>
  findInstance(DCContractName, await customWeb3.getWeb3());

const getRecoveryLogic = async () =>
  findInstance(recoveryLogicContractName, await customWeb3.getWeb3());

const findInstance = async (contract, web3) => {
  console.log(contract);
  if (!contract.instance) {
    const contractJSON = require(`../../build/contracts/${contract.name}`);
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
  getRegistryContract,
  getDCContract,
  getRecoveryLogic
};
