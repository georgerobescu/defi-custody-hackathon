import React, { useState, useEffect } from "react";
import { inject, observer } from "mobx-react";
import { compose } from "recompose";
import { drizzleReactHooks } from "../../../../../drizzle";
import { fetchDeFi } from "../../../../../blockchain/SmartContractCalls";
import { TransactionStatus } from "../../../../../constants/TransactionStatusEnum";
import Spinner from "../../../../utils/Spinner";

const BZX_COMPOUND_DYDX =
  "0x87e3990b15e1e64e3a17b0e4ebfcc4c03cc5ec64a33b442ae01ef15d9dadb575";

const DepositWrapper = ({ DSCStore, Web3Store, children }) => {
  const { useCacheSend } = drizzleReactHooks.useDrizzle();
  const { send, TXObjects } = useCacheSend("TestDAI", "approve");
  const [depositAmount, setDepositAmount] = useState(0);
  const successToast = {
    successTitle: "Successfully deposited!",
    successSubtitle: receipt => "Transaction mined"
  };
  const getStatus = async TXObjects => {
    if (TXObjects.status === TransactionStatus.SUCCESS) {
      const data = {
        portfolioId: BZX_COMPOUND_DYDX,
        payableBeneficiary: Web3Store.defaultAccount,
        value: depositAmount
      };
      const response = await fetchDeFi("invest", data);
      console.log(response);
      TXObjects.receipt = response;
    }
    return {
      ...TXObjects,
      successToast
    };
  };
  console.log(TXObjects, "what??");
  const transfer = (amount, token) => {
    send(DSCStore.drizzle.contracts.DeFiCustodyRegistry.address, amount);
    setDepositAmount(amount);
  };
  return children({ transfer, TXObjects, successToast, getStatus });
};

export default compose(
  inject("DSCStore", "Web3Store"),
  observer
)(DepositWrapper);
