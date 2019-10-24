import React, { useEffect } from "react";
import { drizzleReactHooks } from "../../../../drizzle";
import View from "./View";

const DSCAssetsContainer = () => {
  const { useCacheCall } = drizzleReactHooks.useDrizzle();
  const walletAddress = useCacheCall(
    "DeFiCustodyRegistry",
    "getWalletBySender"
  );
  useEffect(() => {
    if (walletAddress) {
    }
  }, [walletAddress]);
  return <View />;
};

export default DSCAssetsContainer;
