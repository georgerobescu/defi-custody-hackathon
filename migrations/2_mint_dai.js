const TestDAI = artifacts.require("TestDAI.sol");

module.exports = async (deployer, network, accounts) => {
  switch (network) {
    case "development":
      let dai = new web3.eth.Contract(TestDAI.abi, "0x7F6319187249dB5ec845F92ffA3318A9E6604293");
      let tx = await dai.methods.issueTo(10000).send({from: accounts[0]});
      console.log(`Minted ${await dai.methods.balanceOf(accounts[0]).call()} DAI for addres ${accounts[0]}1`);
      break;
  }
};