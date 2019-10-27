import { useEffect } from "react";
import { inject, observer } from "mobx-react";
import { compose } from "recompose";
import {
  fetchUserBalances,
  fetchSmartContractAssets,
  mergeTokenAndBalances,
  fetchUserBalance
} from "../../../../blockchain/SmartContractCalls";
import { drizzleReactHooks } from "../../../../drizzle";
const AssetsObserver = ({ DSCStore, Web3Store }) => {
  const { useCacheCall } = drizzleReactHooks.useDrizzle();
  //useCacheCall("DeFiCustodyRegistry", "getTokens");
  // kovan 0xc4375b7de8af5a38a93548eb8453a498222c4ff2
  const supportedTokens = ["0x7F6319187249dB5ec845F92ffA3318A9E6604293"];

  const smartContractTokens = useCacheCall(
    "DeFiCustodyRegistry",
    "getSenderTokens"
  );
  useEffect(() => {
    const fetchSmartContractData = async () => {
      console.log(
        "Fetching data from DeFiCustody: ",
        DSCStore.drizzle.contracts.DeFiCustodyRegistry.address
      );
      const balances = await fetchUserBalance(
        DSCStore,
        Web3Store.defaultAccount,
        Web3Store.web3.utils.toBN
      );
      console.log(balances);
      const [smartContractAssets, addresses] = await fetchSmartContractAssets(
        Web3Store,
        DSCStore,
        smartContractTokens
      );
      const mergedTokens = mergeTokenAndBalances(
        supportedTokens,
        balances,
        smartContractAssets
      );
      DSCStore.setAddresses(addresses);
      DSCStore.setTokens(mergedTokens);
      DSCStore.setTokensFetched(true);
      console.log("Data fetched.");
    };
    supportedTokens && smartContractTokens && fetchSmartContractData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supportedTokens, smartContractTokens]);
  return null;
};

export default compose(
  inject("DSCStore", "Web3Store"),
  observer
)(AssetsObserver);
