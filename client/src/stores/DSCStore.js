import { action, autorun, computed, observable } from "mobx";
import Web3 from "web3";

class DSCStore {
  @observable addresses = [undefined, undefined, undefined, undefined];
  @observable tokens = [];
  @observable isInteractionAllowed = false;
  @observable isFetched = false;

  @action
  changePercentage = (tokenIndex, address, value) => {
    value = parseInt(value);
    if (value > 100) {
      value = 100;
    }
    if (value < 0) {
      value = 0;
    }
    let sum = 0;
    this.addresses.forEach(addr => {
      if (addr !== address && this.tokens[tokenIndex].percentage[addr])
        sum += this.tokens[tokenIndex].percentage[addr];
    });
    if (value + sum > 100) {
      value = 100 - sum;
    }
    this.tokens[tokenIndex].percentage[address] = value;
  };

  @action
  setTokens = tokens => {
    this.tokens = tokens.map((token, i) => ({ ...token, index: i }));
    this.isInteractionAllowed = true;
  };

  @action
  setAddresses = addresses => (this.addresses = addresses);

  @action
  setTokensFetched = state => (this.isFetched = state);

  @action
  setIsInteractionAllowed = state => (this.isInteractionAllowed = state);

  @action
  transferTokens = (token, amount) => {
    this.tokens[token.index].balance -= amount;
    this.tokens[token.index].amount += amount;
    this.isInteractionAllowed = true;
  };
}

const store = new DSCStore();
export default store;
