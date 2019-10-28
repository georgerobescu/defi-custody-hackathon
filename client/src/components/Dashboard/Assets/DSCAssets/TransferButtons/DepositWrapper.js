import { inject, observer } from "mobx-react";
import { compose } from "recompose";
import { drizzleReactHooks } from "../../../../../drizzle";

const TransferButtonsHookWrapper = ({ DSCStore, Web3Store, children }) => {
  const { useCacheSend } = drizzleReactHooks.useDrizzle();
  const { send, TXObjects } = useCacheSend("MockedERC20", "approve");
  const successToast = {
    successTitle: "Successfully deposited!",
    successSubtitle: receipt => {
      console.log(receipt);
      return "mined";
    }
  };
  return children({ transfer: send, TXObjects, successToast });
};

export default compose(
  inject("DSCStore", "Web3Store"),
  observer
)(TransferButtonsHookWrapper);
