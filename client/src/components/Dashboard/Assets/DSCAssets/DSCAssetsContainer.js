import React from "react";
import { inject, observer } from "mobx-react";
import { compose } from "recompose";
import Wallet from "./Wallet";
import View from "./View";

const DSCAssetsContainer = ({ DSCStore }) => {
  const wallet = DSCStore.drizzle ? <Wallet /> : "Please connect to metamask.";
  return <View wallet={wallet} />;
};

export default compose(
  inject("DSCStore"),
  observer
)(DSCAssetsContainer);
