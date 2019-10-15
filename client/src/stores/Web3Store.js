import { action, autorun, computed, observable } from "mobx";
import Web3 from "web3";

class Web3Store {
  @observable web3;
  @observable loading = true;

  @action
  setWeb3 = (web3, accounts) => {
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
