import React, { useEffect } from "react";
import { inject, observer } from "mobx-react";
import { compose } from "recompose";
import Wallet from "./Wallet";
import { isZeroAddress } from "../../../../utils/ethereum";
import { drizzleReactHooks } from "../../../../drizzle";
import {
  fetchUserBalances,
  fetchSmartContractAssets,
  mergeTokenAndBalances
} from "../../../../blockchain/SmartContractCalls";

const WalletContainer = ({ DSCStore, Web3Store }) => {
  const { useCacheCall } = drizzleReactHooks.useDrizzle();
  const walletAddress = useCacheCall(
    "DeFiCustodyRegistry",
    "getWalletBySender"
  );
  useEffect(() => {
    if (
      walletAddress &&
      !isZeroAddress(walletAddress) &&
      !DSCStore.walletAddress
    ) {
      DSCStore.setWalletAddress(walletAddress);
    }
  }, [DSCStore, walletAddress]);

  useEffect(() => {
    const fetchSmartContractData = async () => {
      console.log(DSCStore.walletAddress, " wallet found! fetching data.");
      const balances = await fetchUserBalances(
        Web3Store.defaultAccount,
        Web3Store.web3.utils.toBN
      );
      const [tokens, addresses] = await fetchSmartContractAssets(
        Web3Store.web3,
        DSCStore
      );
      const mergedTokens = mergeTokenAndBalances(balances, tokens);
      DSCStore.setTokens(mergedTokens);
      DSCStore.setAddresses(addresses);
      DSCStore.setTokensFetched(true);
      console.log(DSCStore.walletAddress, " wallet data fetched.");
    };
    DSCStore.walletAddress && fetchSmartContractData();
  }, [
    DSCStore,
    DSCStore.walletAddress,
    Web3Store.defaultAccount,
    Web3Store.web3
  ]);

  return <Wallet walletAddress={walletAddress} />;
};

export default compose(
  inject("DSCStore", "Web3Store"),
  observer
)(WalletContainer);
