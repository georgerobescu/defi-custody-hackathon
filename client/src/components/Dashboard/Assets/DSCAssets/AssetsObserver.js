import { useEffect } from "react";
import { inject, observer } from "mobx-react";
import { compose } from "recompose";
import {
  fetchUserBalances,
  fetchWallet,
  mergeTokenAndBalances
} from "../../../../blockchain/SmartContractCalls";
import { drizzleReactHooks } from "../../../../drizzle";

const AssetsObserver = ({ DSCStore, Web3Store }) => {
  const { useCacheCall } = drizzleReactHooks.useDrizzle();
  const tokens = useCacheCall("DeFiCustodyRegistry", "getSenderTokens");
  useEffect(() => {
    console.log(tokens);
    console.log();
    const fetchSmartContractData = async () => {
      console.log("Fetching data.");
      const balances = await fetchUserBalances(
        Web3Store.defaultAccount,
        Web3Store.web3.utils.toBN
      );
      const [tokens, addresses] = await fetchWallet(Web3Store.web3, DSCStore);
      const mergedTokens = mergeTokenAndBalances(balances, tokens);
      DSCStore.setTokens(mergedTokens);
      DSCStore.setAddresses(addresses);
      DSCStore.setTokensFetched(true);
      console.log("Data fetched.");
    };
    tokens && fetchSmartContractData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokens]);
  return null;
};

export default compose(
  inject("DSCStore", "Web3Store"),
  observer
)(AssetsObserver);
