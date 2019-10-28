import { inject, observer } from "mobx-react";
import { compose } from "recompose";
import { drizzleReactHooks } from "../../../../../drizzle";

const TransferButtonsHookWrapper = ({ DSCStore, Web3Store, children }) => {
  const { useCacheSend } = drizzleReactHooks.useDrizzle();
  const { send, TXObjects } = useCacheSend(
    "DeFiCustodyRegistry",
    "getRayTokens"
  );
  // const rayTokenIds = await DSCStore.drizzle.contracts.DeFiCustodyRegistry.methods
  // .getRayTokens(Web3Store.defaultAccount)
  // .call();
  const transfer = amount => {
    amount = new Web3Store.web3.utils.BN(amount.toString()).abs();

    //TODO fix to range
    const rayTokenId = 1; // rayTokenIds[0];
    console.log(
      "Smart contract call, withdraw: ",
      rayTokenId,
      amount.toString(),
      Web3Store.defaultAccount
    );
  };

  const successToast = {
    successTitle: "Withdraw completed!",
    successSubtitle: receipt => {
      console.log(receipt);
      return "mined";
    }
  };
  return children({ transfer, TXObjects, successToast });
};

export default compose(
  inject("DSCStore", "Web3Store"),
  observer
)(TransferButtonsHookWrapper);
