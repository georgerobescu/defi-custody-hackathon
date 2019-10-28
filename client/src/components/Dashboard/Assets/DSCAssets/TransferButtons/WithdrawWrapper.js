import React from "react";
import { inject, observer } from "mobx-react";
import { compose } from "recompose";
import { drizzleReactHooks } from "../../../../../drizzle";
import Spinner from "../../../../utils/Spinner";

const TransferButtonsHookWrapper = ({ DSCStore, Web3Store, children }) => {
  const { useCacheSend, useCacheCall } = drizzleReactHooks.useDrizzle();
  const { send, TXObjects } = useCacheSend(
    "DeFiCustodyRegistry",
    "redeemAndWithdraw"
  );
  const rayTokenIds = useCacheCall(
    "DeFiCustodyRegistry",
    "getRayTokens",
    Web3Store.defaultAccount
  );
  const transfer = amount => {
    amount = new Web3Store.web3.utils.BN(amount.toString()).abs();
    //TODO fix to range
    const rayTokenId = rayTokenIds[0];
    send(rayTokenId, amount.toString(), Web3Store.defaultAccount);
  };

  const successToast = {
    successTitle: "Withdraw completed!",
    successSubtitle: receipt => {
      console.log(receipt);
      return "mined";
    }
  };
  return !rayTokenIds ? (
    <Spinner />
  ) : (
    children({ transfer, TXObjects, successToast })
  );
};

export default compose(
  inject("DSCStore", "Web3Store"),
  observer
)(TransferButtonsHookWrapper);
