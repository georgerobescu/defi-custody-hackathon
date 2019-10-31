import { action, computed, observable } from "mobx";

class Web3Store {
  //TODO delete web3
  @observable web3;

  @action
  setWeb3 = async (web3, accounts) => {
    web3.eth.defaultAccount = accounts[0];
    this.web3 = web3;
  };

  @computed get defaultAccount() {
    return this.web3.eth.defaultAccount;
  }
}

const store = new Web3Store();
export default store;
