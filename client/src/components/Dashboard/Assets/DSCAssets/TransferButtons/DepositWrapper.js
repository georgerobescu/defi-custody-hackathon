import { inject, observer } from "mobx-react";
import { compose } from "recompose";
import { drizzleReactHooks } from "../../../../../drizzle";
import { fetchDeFi } from "../../../../../blockchain/SmartContractCalls";

const BZX_COMPOUND_DYDX =
  "0x87e3990b15e1e64e3a17b0e4ebfcc4c03cc5ec64a33b442ae01ef15d9dadb575";

const TransferButtonsHookWrapper = ({ DSCStore, Web3Store, children }) => {
  const { useCacheSend } = drizzleReactHooks.useDrizzle();
  const { send, TXObjects } = useCacheSend("MockedERC20", "approve");
  const successToast = {
    successTitle: "Successfully deposited!",
    successSubtitle: receipt => {
      // const data = {
      //   portfolioId: BZX_COMPOUND_DYDX,
      //   payableBeneficiary: Web3Store.defaultAccount,
      //   value: amount
      // };
      // const request = fetchDeFi("invest", data);
      return "mined";
    }
  };
  const transfer = async (amount, token) => {
    await send(DSCStore.drizzle.contracts.DeFiCustodyRegistry.address, amount);
  };
  return children({ transfer, TXObjects, successToast });
};

export default compose(
  inject("DSCStore", "Web3Store"),
  observer
)(TransferButtonsHookWrapper);
