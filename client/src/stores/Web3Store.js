import { action, computed, observable } from "mobx";

const DeFiCustodyRegistry = require("../../../build/contracts/DeFiCustodyRegistry");
class Web3Store {
  @observable web3;
  @observable loading = true;
  @observable DeFiCustodyRegistry;

  @action
  setWeb3 = async (web3, accounts) => {
    web3.eth.defaultAccount = accounts[0];
    this.web3 = web3;
    this.loading = false;
  };

  @computed get defaultAccount() {
    return this.web3.eth.defaultAccount;
  }
}

const store = new Web3Store();
export default store;
