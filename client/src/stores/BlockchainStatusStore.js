import { action, observable } from "mobx";

class BlockchainStatusStore {
  @observable metamaskLoading = true;
  @observable isAssetsFetched = false;

  @action
  setMetamaskLoading = status => {
    this.metamaskLoading = status;
  };

  @action
  setTokensFetched = state => {
    this.isAssetsFetched = state;
  };
}

const store = new BlockchainStatusStore();
export default store;
