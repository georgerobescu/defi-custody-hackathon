import React from "react";
import { inject, observer } from "mobx-react";
import { compose } from "recompose";
import Wallet from "./Wallet";
import { isZeroAddress } from "../../../../utils/ethereum";
import { drizzleReactHooks } from "../../../../drizzle";
import { fetchUserBalances } from "../../../../blockchain/SmartContractCalls";

const WalletContainer = ({ DSCStore, Web3Store }) => {
  const { useCacheCall } = drizzleReactHooks.useDrizzle();
  const walletAddress = useCacheCall(
    "DeFiCustodyRegistry",
    "getWalletBySender"
  );
  if (!isZeroAddress(walletAddress)) {
    //TODO fix workaround !DSCStore.walletAddress in if statement not working
    !DSCStore.walletAddress && DSCStore.setWalletAddress(walletAddress);
    !DSCStore.walletAddress && fetchUserBalances(Web3Store.defaultAccount);
  }
  return <Wallet walletAddress={walletAddress} />;
};

export default compose(
  inject("DSCStore", "Web3Store"),
  observer
)(WalletContainer);
