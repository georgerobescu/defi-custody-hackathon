//TODO fetch balances -> filter -> fetchDCSAmount -> fetchEarnings
export const fetchTokens = DSCStore => {
  const dummyTokens = [
    {
      address: "0x21",
      name: "DAI",
      symbol: "DAI",
      balance: 100.93,
      amount: 7.93,
      earnings: 1,
      percentage: {}
    },
    {
      address: "0x22",
      name: "DAI1",
      symbol: "DAI1",
      balance: 100,
      amount: 4.93,
      earnings: 2,
      percentage: {}
    },
    {
      address: "0x23",
      name: "DAI2",
      symbol: "DAI2",
      balance: 200.93,
      amount: 0.93,
      earnings: 3,
      percentage: {}
    }
  ];
  const dummyAddresses = [
    "0x004120f424F83417C68109Cc8522594c22528d3c",
    "0x004120f424F83417C68109Cc8522594c22521234",
    "0x004120f424F83417C68109Cc8522594c2252abcd",
    "0x004120f424F83417C68109Cc8522594c22525678"
  ];
  DSCStore.setTokens(dummyTokens);
  DSCStore.setAddresses(dummyAddresses);
  DSCStore.setTokensFetched(true);
};

export const depositTokens = (web3, amount, token) => {
  console.log("Smart contract call, deposit", amount);
};
export const withdrawTokens = (web3, amount, token) => {
  console.log("Smart contract call, withdraw", amount);
};
