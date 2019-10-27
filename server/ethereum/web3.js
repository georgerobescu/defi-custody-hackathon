const web3Library = require("web3");
// Create your own key for Production environments (https://infura.io/)

const fs = require("fs");

const mnemonic = process.env.DEFICUSTODY_PRIVATE_KEY;
const network = process.env.NETWORK || "development";
const INFURA_ID = process.env.INFURA_ID || "d6760e62b67f4937ba1ea2691046f06d";

const path = "m/44'/60'/0'/0/";
class Web3 {
  constructor() {
    var providerConfig
    const { gas } = JSON.parse(
      fs.readFileSync(`${__dirname}/../config/deployConfig.json`, 'utf8'),
    )
    if (network == "development") {
      providerConfig = "http://localhost:8545";
    } else {
      providerConfig = "http://localhost:8545";
    }
    console.log(providerConfig)

    this.gas = gas;
    const provider = new web3Library.providers.HttpProvider(providerConfig);
    const web3 = new web3Library(provider);
    this._web3 = web3;
  }

  getWeb3() {
    return this._web3;
  }

  async initAccount() {
    const accounts = await this._web3.eth.getAccounts();
    if (accounts.length === 0) {
      if (mnemonic == "") {
        var privateKey =
          "0x" + fs.readFileSync(`${__dirname}/../config/privateKey`, "utf8");
      } else {
        var privateKey = mnemonic;
      }
      const account = this._web3.eth.accounts.privateKeyToAccount(privateKey);
      this._web3.eth.accounts.wallet.add(account);
      this._web3.eth.defaultAccount = account.address;
    } else {
      this._web3.eth.defaultAccount = accounts[0];
    }
    console.log(`Default account: ${this._web3.eth.defaultAccount}`);
  }

  sendFromMain(transaction) {
    return transaction.send({
      from: this._web3.eth.defaultAccount,
      gas: this.gas,
      gasPrice: 10 ** 10
    });
  }
}

instance = new Web3();

module.exports = instance;
