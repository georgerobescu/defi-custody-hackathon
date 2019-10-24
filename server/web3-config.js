


web3js = new web3(
    //new web3.providers.HttpProvider("https://rinkeby.infura.io/YOUR_API_KEY")
    new web3.providers.HttpProvider("HTTP://127.0.0.1:7545")
);

web3js.eth.net.isListening().then(listening => {
    if (!listening) {
        console.log("not connected");
        process.exit();
    }
});


export 