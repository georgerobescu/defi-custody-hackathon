import { action, computed, observable } from "mobx";
import { toast } from "react-toastify";
import { DeadlineFormat } from "../constants/DeadlineTimeFormatEnum";

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
  @observable drizzle;
  @observable drizzleConnected = false;
  @observable newDeadline;
  @observable walletAddress;
  @observable deadlineFormat = DeadlineFormat.SECONDS;

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
        sum += parseInt(this.tokens[tokenIndex].percentage[addr]);
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
  setIsInteractionAllowed = state => (this.isInteractionAllowed = state);

  @action
  transferTokens = (token, amount) => {
    amount = new this.BN(amount.toString());
    const newBalance = new this.BN(
      this.tokens[token.index].balance.toString()
    ).sub(amount);
    const newAmount = new this.BN(
      this.tokens[token.index].amount.toString()
    ).add(amount);
    this.tokens[token.index].balance = newBalance.toString();
    this.tokens[token.index].amount = newAmount.toString();
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
    if (deadline > 0) {
      this.newDeadline = deadline;
    }
  };

  @action
  setWalletAddress = address => {
    this.walletAddress = address;
  };

  @computed get hasNotToken() {
    let hasToken = false;
    this.tokens.forEach(token => {
      if (token.amount > 0) {
        hasToken = true;
      }
    });
    return !hasToken || this.tokens.length === 0 || !this.isInteractionAllowed;
  }

  idValidRecoverySheet = tokenIndex => {
    const sum = this.percentageSum(tokenIndex);
    if (sum !== 100) {
      toast.error(`Ooops, wrong percentage sum, ${sum}`);
      return false;
    }
    if (!this.newDeadline || this.newDeadline <= 0) {
      toast.error(
        this.newDeadline
          ? `Wrong deadline date, ${this.newDeadline}`
          : "Please set deadline date"
      );
      return false;
    }
    let correctAddresses = true;
    this.addresses.forEach(
      address => (correctAddresses = correctAddresses && address)
    );
    if (!correctAddresses) {
      toast.error("Please set recovery addresses");
      return false;
    }
    return true;
  };

  getRecoverySheet = (tokenIndex = 0, toWei) => {
    const percentages = this.addresses.map(address => {
      const percent = this.tokens[tokenIndex].percentage[address];
      return toWei(percent ? percent.toString() + "0" : "0", "milli");
    });
    const deadline = DeadlineFormat.getTime(
      parseInt(this.newDeadline),
      this.deadlineFormat
    );
    return [this.tokens[0].address, [...this.addresses], percentages, deadline];
  };

  @action
  setDeadlineFormat = format => {
    this.deadlineFormat = format;
  };

  setBN = BN => {
    this.BN = BN;
  };

  percentageSum = tokenIndex => {
    let sum = 0;
    this.addresses.forEach(addr => {
      if (addr && this.tokens[tokenIndex].percentage[addr])
        sum += parseInt(this.tokens[tokenIndex].percentage[addr]);
    });
    return sum;
  };
}

const store = new DSCStore();
export default store;
