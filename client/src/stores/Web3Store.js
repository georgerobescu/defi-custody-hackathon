import { action, computed, observable } from "mobx";

class Web3Store {
  @observable web3;
  @observable metamaskLoading = true;
  @observable isFetched = false;

  @action
  setWeb3 = async (web3, accounts) => {
    web3.eth.defaultAccount = accounts[0];
    this.web3 = web3;
  };

  @action
  setMetamaskLoading = status => {
    this.metamaskLoading = status;
  };

  @action
  setTokensFetched = state => (this.isFetched = state);

  @computed get defaultAccount() {
    return this.web3.eth.defaultAccount;
  }
}

const store = new Web3Store();
export default store;
