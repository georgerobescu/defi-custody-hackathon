const web3Library = require("web3");
// Create your own key for Production environments (https://infura.io/)

const fs = require("fs");

const network = process.env.NETWORK || "development";
const INFURA_ID = process.env.INFURA_ID || "d6760e62b67f4937ba1ea2691046f06d";

class Web3 {
  constructor() {
    let providerConfig;
    const { gas } = JSON.parse(
      fs.readFileSync(`${__dirname}/../config/deployConfig.json`, "utf8")
    );
    if (process.env.NODE_ENV === "prod") {
      providerConfig = `https://${network}.infura.io/v3/${INFURA_ID}`;
    } else {
      providerConfig = "http://localhost:8545";
    }

    this.gas = gas;
    const provider = new web3Library.providers.HttpProvider(providerConfig);
    this._web3 = new web3Library(provider);
    this.initAccount();
  }

  getWeb3() {
    return this._web3;
  }

  async initAccount() {
    const accounts = await this._web3.eth.getAccounts();
    if (accounts.length === 0) {
      const privateKey = process.env.DEFICUSTODY_PRIVATE_KEY
        ? process.env.DEFICUSTODY_PRIVATE_KEY
        : fs.readFileSync(`${__dirname}/../config/privateKey`, "utf8");
      const account = this._web3.eth.accounts.privateKeyToAccount(
        "0x" + privateKey
      );
      this._web3.eth.accounts.wallet.add(account);
      this._web3.eth.defaultAccount = account.address;
    } else {
      this._web3.eth.defaultAccount = accounts[0];
    }
    const balance = await this._web3.eth.getBalance(
      this._web3.eth.defaultAccount
    );
    console.log(
      `Default account: ${this._web3.eth.defaultAccount}, balance: ${balance}`
    );
  }

  sendFromMain(transaction) {
    return transaction.send({
      from: this._web3.eth.defaultAccount,
      gas: this.gas
    });
  }
}

instance = new Web3();

module.exports = instance;
