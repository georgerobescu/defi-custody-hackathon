import React from "react";
import { inject, observer } from "mobx-react";
import { compose } from "recompose";
import View from "./View";
import AssetsObserver from "./AssetsObserver";

const DSCAssetsContainer = ({ DSCStore }) => {
  return (
    <>
      {DSCStore.drizzle && <AssetsObserver />}
      <View
        wallet={DSCStore.drizzle ? "Wallet" : "Please connect to metamask."}
      />
    </>
  );
};

export default compose(
  inject("DSCStore"),
  observer
)(DSCAssetsContainer);
