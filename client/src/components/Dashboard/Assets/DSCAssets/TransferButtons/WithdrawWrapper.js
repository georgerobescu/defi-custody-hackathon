import React, { useEffect, useState } from "react";
import { inject, observer } from "mobx-react";
import { compose } from "recompose";
import { drizzleReactHooks } from "../../../../../drizzle";
import Spinner from "../../../../utils/Spinner";
import { TransactionStatus } from "../../../../../constants/TransactionStatusEnum";
import { fetchDeFi } from "../../../../../blockchain/SmartContractCalls";

const TransferButtonsHookWrapper = ({ DSCStore, Web3Store, children }) => {
  const [completeTransfer, setCompleteTransfer] = useState();
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
  const transfer = (amount, completeTransfer) => {
    amount = new Web3Store.web3.utils.BN(amount.toString()).abs();
    setCompleteTransfer(() => completeTransfer);
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
  const getStatus = async TXObjects => {
    if (TXObjects.status !== TransactionStatus.PENDING && completeTransfer) {
      completeTransfer(TXObjects.status === TransactionStatus.ERROR);
    }
    return TXObjects;
  };

  return !rayTokenIds ? (
    <Spinner />
  ) : (
    children({ transfer, TXObjects, successToast, getStatus })
  );
};

export default compose(
  inject("DSCStore", "Web3Store"),
  observer
)(TransferButtonsHookWrapper);
