const web3Library = require('web3')
const fs = require('fs')

class Web3 {

  constructor () {
    const { providerConfig, gas } = JSON.parse(
      fs.readFileSync(`${__dirname}/../config/deployConfig.json`, 'utf8'),
    )
    this.gas = gas
    const provider = new web3Library.providers.HttpProvider(providerConfig)
    const web3 = new web3Library(provider)
    this._web3 = web3
  }

  getWeb3 () {
    return this._web3
  }

  async initAccount () {
    const accounts = await this._web3.eth.getAccounts()
    if (accounts.length === 0) {
      const privateKey = '0x' +
        fs.readFileSync(`${__dirname}/../config/privateKey`, 'utf8')
      const account = this._web3.eth.accounts.privateKeyToAccount(privateKey)
      this._web3.eth.accounts.wallet.add(account)
      this._web3.eth.defaultAccount = account.address
    } else {
      this._web3.eth.defaultAccount = accounts[0]
    }
    console.log(`Default account: ${this._web3.eth.defaultAccount}`)
  }

  sendFromMain (transaction) {
    return transaction.send(
      { from: this._web3.eth.defaultAccount, gas: this.gas })
  }
}

instance = new Web3()

module.exports = instance
