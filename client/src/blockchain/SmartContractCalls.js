//TODO fetch balances -> filter -> fetchDCSAmount -> fetchEarnings
import { generateDicimaledBalance } from "../utils/ethereum";

const API_KEY = "UAK3dea068114955255b188b0cdfd12c9ae";
const RINKEBY_ID = "1b3f7a72b3e99c13";

export const fetchSmartContractAssets = async (
  Web3Store,
  DSCStore,
  smartContractTokens
) => {
  const tokens = {};
  const recoveryWallets = await DSCStore.drizzle.contracts.DeFiCustodyRegistry.methods
    .getRecoveryWallets(Web3Store.defaultAccount)
    .call();
  const percentages = [];
  for (let i = 0; i < smartContractTokens.tokens.length; i++) {
    const promises = recoveryWallets.map(recoveryWallet =>
      DSCStore.drizzle.contracts.DeFiCustodyRegistry.recoverySheet(
        Web3Store.defaultAccount,
        recoveryWallet,
        smartContractTokens.tokens[i]
      ).call()
    );
    const percentage = await Promise.all(promises);
    const tokenPercentage = {};
    percentage.forEach((percent, i) => {
      tokenPercentage[recoveryWallets[i]] = percent;
    });
    percentages.push(percentage);
  }
  //TODO earnings
  smartContractTokens.tokens
    .map((token, i) => ({
      address: token,
      amount: smartContractTokens.balances[i],
      percentage: percentages[i],
      earnings: 0
    }))
    .forEach(token => {
      tokens[token.address] = token;
    });
  return [tokens, recoveryWallets];
};

export const fetchRayTokenBalances = async DSCStore => {
  const dummyTokens = [
    {
      address: "0x742ba81f0d827c7de4fbf077ac57a74a20ea029b",
      amount: 7.93,
      earnings: 1,
      percentage: {}
    }
    // {
    //   address: "0x22",
    //   amount: 4.93,
    //   earnings: 2,
    //   percentage: {}
    // }
  ];
  const dummyAddresses = [
    "0x004120f424F83417C68109Cc8522594c22528d3c",
    "0x004120f424F83417C68109Cc8522594c22521234",
    "0x004120f424F83417C68109Cc8522594c2252abcd",
    "0x004120f424F83417C68109Cc8522594c22525678"
  ];
  return [dummyTokens, dummyAddresses];
};
// TODO fix porfolioId
const BZX_COMPOUND_DYDX =
  "0x87e3990b15e1e64e3a17b0e4ebfcc4c03cc5ec64a33b442ae01ef15d9dadb575";

export const depositTokens = async (Web3Store, amount, token) => {
  const data = {
    portfolioId: BZX_COMPOUND_DYDX,
    payableBeneficiary: Web3Store.defaultAccount,
    value: amount
  };
  const request = await fetchDeFi("invest", data);
  console.log("sdf");
  console.log(request);
  console.log("Smart contract call, deposit", amount);
};
export const withdrawTokens = (web3, amount, token) => {
  console.log("Smart contract call, withdraw", amount);
};

// TODO work only on mainnet and rinkeby
export const fetchUserBalances = async (address, toBN) => {
  const balances = await fetchBalances(address, toBN);
  const tokens = {};
  balances.forEach(balance => {
    tokens[balance.address] = balance;
  });
  return tokens;
};

export const fetchUserBalance = async (DSCStore, address, toBN) => {
  console.log("DAI address: ", DSCStore.drizzle.contracts.MockedERC20.address);
  const amount = await DSCStore.drizzle.contracts.MockedERC20.methods
    .balanceOf(address)
    .call();
  console.log(amount);
  const name = "Dai test";
  // await DSCStore.drizzle.contracts.MockedERC20.methods
  //   .name()
  //   .call();
  const symbol = "DAI";
  // await DSCStore.drizzle.contracts.MockedERC20.methods
  //   .symbol()
  //   .call();
  const decimals = 2;
  // await DSCStore.drizzle.contracts.MockedERC20.methods
  //   .decimals()
  //   .call();
  const balance = {
    balance: parseInt(amount),
    amount: 0,
    name,
    symbol,
    decimals: parseInt(decimals),
    address: DSCStore.drizzle.contracts.MockedERC20.options.address
  };
  const token = {};
  token[DSCStore.drizzle.contracts.MockedERC20.options.address] = balance;
  return token;
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

export const mergeTokenAndBalances = (
  supportedTokens,
  balances,
  smartContractAssets
) =>
  supportedTokens.map(token => ({
    ...balances[token],
    ...smartContractAssets[token]
  }));

const fetchDeFi = async (uri = "", data = {}, method = "POST") => {
  try {
    const response = await fetch(`${process.env.REACT_APP_MAIN_URL}${uri}`, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json"
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow",
      referrer: "no-referrer",
      body: JSON.stringify(data)
    });
    console.log("Success:");
    return await response.json();
  } catch (error) {
    console.error("Failure:", error);
  }
};
