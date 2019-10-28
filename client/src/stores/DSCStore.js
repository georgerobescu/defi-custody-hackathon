import { action, observable } from "mobx";

class DSCStore {
  BN;
  @observable addresses = [undefined];
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
    console.log(tokenIndex, address, value, this.tokens[tokenIndex].percentage);
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
    amount = new this.BN(amount);
    const decimalsPower = new this.BN(10).pow(
      this.tokens[token.index].decimals
    );
    amount.mul(decimalsPower);
    amount = Math.trunc(amount);
    console.log(amount, parseInt(this.tokens[token.index].balance));
    const newBalance = parseInt(this.tokens[token.index].balance) - amount;
    const newAmount = parseInt(this.tokens[token.index].amount) + amount;
    console.log(newBalance, newAmount);
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

  @action
  setRecoverySheet = async (tokenIndex = 0, toWei) => {
    const percentages = this.addresses.map(address =>
      toWei(
        this.tokens[tokenIndex].percentage[address].toString() + "0",
        "milli"
      )
    );
    console.log(
      "Setting recovery sheet",
      this.tokens[0].address,
      [...this.addresses],
      percentages,
      parseInt(this.newDeadline)
    );
    const result = await this.drizzle.contracts.DeFiCustodyRegistry.methods
      .setRecoverySheet(
        this.tokens[0].address,
        [...this.addresses],
        percentages,
        parseInt(this.newDeadline)
      )
      .send();
    console.log(result);
  };
  setBN = BN => {
    this.BN = BN;
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
