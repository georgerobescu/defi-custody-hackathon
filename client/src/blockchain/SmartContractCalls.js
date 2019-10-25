//TODO fetch balances -> filter -> fetchDCSAmount -> fetchEarnings
import { generateDicimaledBalance } from "../utils/ethereum";

const API_KEY = "UAK3dea068114955255b188b0cdfd12c9ae";
const RINKEBY_ID = "1b3f7a72b3e99c13";

export const fetchWallet = (web3, DSCStore) => {
  fetchTokens(DSCStore);
};
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

export const fetchUserBalances = async (address, toBN) => {
  const balances = await fetchBalances(address, toBN);
  return balances.filter(balance => filterToken(balance));
};

export const fetchBalances = async (address, toBN) => {
  const response = await fetch(
    `https://cors-anywhere.herokuapp.com/https://web3api.io/api/v1/addresses/${address}/tokens`,
    {
      headers: {
        "x-api-key": API_KEY,
        "x-amberdata-blockchain-id": RINKEBY_ID
      }
    }
  );
  const result = await response.json();
  if (result.status === 200) {
    const {
      payload: { records }
    } = result;
    const balances = [];
    records.forEach(balance => {
      if (balance.isERC20) {
        balances.push(generateDicimaledBalance(balance, toBN));
      }
    });
    return balances;
  }
};

const filterToken = balance => {
  console.log(balance);
  return true;
};
