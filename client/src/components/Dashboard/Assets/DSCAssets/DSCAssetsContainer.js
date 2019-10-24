import React from "react";
import { inject, observer } from "mobx-react";
import { compose } from "recompose";
import BlockchainAssets from "./BlockchainAssets";
import View from "./View";

const DSCAssetsContainer = ({ DSCStore }) => {
  return DSCStore.drizzle ? <BlockchainAssets /> : <View />;
};

export default compose(
  inject("DSCStore"),
  observer
)(DSCAssetsContainer);
