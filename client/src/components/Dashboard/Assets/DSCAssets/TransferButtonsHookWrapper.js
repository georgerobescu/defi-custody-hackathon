import React from "react";
import { inject, observer } from "mobx-react";
import { compose } from "recompose";

const TransferButtonsHookWrapper = ({ DSCStore, Web3Store, children }) => {
  console.log("hi hooks");
  // const { useCacheSend } = drizzleReactHooks.useDrizzle();
  //
  // const { send, TXObjects } = useCacheSend(
  //   "DeFiCustodyRegistry",
  //   "createWalletProxy"
  // );
  return children();
};

export default compose(
  inject("DSCStore", "Web3Store"),
  observer
)(TransferButtonsHookWrapper);
