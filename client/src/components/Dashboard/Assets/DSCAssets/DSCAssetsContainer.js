import React from "react";
import { inject, observer } from "mobx-react";
import { compose } from "recompose";
import View from "./View";
import WalletContainer from "./WalletContainer";

const DSCAssetsContainer = ({ DSCStore }) => {
  const wallet = DSCStore.drizzle ? (
    <WalletContainer />
  ) : (
    "Please connect to metamask."
  );
  return <View wallet={wallet} />;
};

export default compose(
  inject("DSCStore"),
  observer
)(DSCAssetsContainer);
