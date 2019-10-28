import { action, observable } from "mobx";

class BlockchainStatusStore {
  @observable metamaskLoading = true;
  @observable isFetched = false;

  @action
  setMetamaskLoading = status => {
    this.metamaskLoading = status;
  };

  @action
  setTokensFetched = state => (this.isFetched = state);
}

const store = new BlockchainStatusStore();
export default store;
