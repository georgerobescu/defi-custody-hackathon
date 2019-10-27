import { action, observable } from "mobx";

class DSCStore {
  @observable addresses = [undefined, undefined, undefined, undefined];
  @observable tokens = [
    {
      address: "-",
      name: "-",
      symbol: "",
      balance: 0,
      amount: 0,
      earnings: 0,
      percentage: {}
    },
    {
      address: "-",
      name: "-",
      symbol: "",
      balance: 0,
      amount: 0,
      earnings: 0,
      percentage: {}
    },
    {
      address: "-",
      name: "-",
      symbol: "",
      balance: 0,
      amount: 0,
      earnings: 0,
      percentage: {}
    }
  ];
  @observable isInteractionAllowed = false;
  @observable isFetched = false;
  @observable drizzle;
  @observable drizzleConnected = false;
  @observable newDeadline = 0;
  @observable walletAddress;

  @action
  changePercentage = (tokenIndex, address, value) => {
    if (this.tokens[tokenIndex].amount === 0) return;
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
  setAddresses = addresses => {
    if (addresses.length > 0) {
      this.addresses = addresses;
    }
  };

  @action
  setTokensFetched = state => (this.isFetched = state);

  @action
  setIsInteractionAllowed = state => (this.isInteractionAllowed = state);

  @action
  transferTokens = (token, amount) => {
    amount *= 10 ** this.tokens[token.index].decimals;
    amount = Math.trunc(amount);
    const newBalance = this.tokens[token.index].balance - amount;
    const newAmount = this.tokens[token.index].amount + amount;
    this.tokens[token.index].balance = parseFloat(
      newBalance.toFixed(6).toString()
    );
    this.tokens[token.index].amount = parseFloat(
      newAmount.toFixed(6).toString()
    );
    console.log(this.tokens[token.index].amount);
    console.log(this.tokens[token.index].balance);
    this.isInteractionAllowed = true;
  };

  @action
  setStore = drizzle => {
    this.drizzle = drizzle;
  };

  @action
  connected = () => {
    this.drizzleConnected = true;
  };

  @action
  setDeadline = deadline => {
    this.newDeadline = deadline;
  };

  @action
  setWalletAddress = address => {
    this.walletAddress = address;
  };

  @action
  updatePercentage = tokenIndex => {
    console.log(this.tokens[tokenIndex], "token percentage updated");
  };

  percentageSum = tokenIndex => {
    let sum = 0;
    this.addresses.forEach(addr => {
      if (this.tokens[tokenIndex].percentage[addr])
        sum += this.tokens[tokenIndex].percentage[addr];
    });
    return sum;
  };
}

const store = new DSCStore();
export default store;
