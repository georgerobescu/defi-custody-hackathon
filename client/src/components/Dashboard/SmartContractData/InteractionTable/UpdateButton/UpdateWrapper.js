import React from "react";
import { inject, observer } from "mobx-react";
import { compose } from "recompose";
import { drizzleReactHooks } from "../../../../../drizzle";

const UpdateWrapper = ({ DSCStore, Web3Store, children }) => {
  const { useCacheSend } = drizzleReactHooks.useDrizzle();
  const { send, TXObjects } = useCacheSend(
    "DeFiCustodyRegistry",
    "setRecoverySheet"
  );
  const successToast = {
    successTitle: "Successfully set recovery sheet!",
    successSubtitle: receipt => "Transaction mined"
  };
  const signTransaction = tokenIndex => {
    if (DSCStore.idValidRecoverySheet(tokenIndex)) {
      const arg = DSCStore.getRecoverySheet(
        tokenIndex,
        Web3Store.web3.utils.toWei
      );
      console.log(arg);
      send(...arg);
    }
  };
  return children({
    disabled: DSCStore.hasNotToken,
    signTransaction,
    TXObjects,
    successToast
  });
};

export default compose(
  inject("DSCStore", "Web3Store"),
  observer
)(UpdateWrapper);
