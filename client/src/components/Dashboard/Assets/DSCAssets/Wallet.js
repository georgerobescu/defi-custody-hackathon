import React, { useCallback } from "react";
import { drizzleReactHooks } from "../../../../drizzle";
import { isZeroAddress } from "../../../../utils/ethereum";
import { Button } from "rimble-ui";
import Spinner from "../../../utils/Spinner";
import TransactionStatus from "../../../blockchain";
import { SpaceBetweenDiv } from "../../../../styled";
import { TransactionStatus as Status } from "../../../../constants/TransactionStatusEnum";

const Wallet = ({ walletAddress }) => {
  const { useCacheSend } = drizzleReactHooks.useDrizzle();
  const { send, TXObjects } = useCacheSend(
    "DeFiCustodyRegistry",
    "createWalletProxy"
  );
  const createWallet = useCallback(
    ({ to, value }) => send("0x23842Cc3b528FC45671e5f6b48F0b89095B96d7E", "0x"),
    [send]
  );
  if (!walletAddress) {
    return <Spinner />;
  }
  let currentStatus;
  if (TXObjects.length > 0 && TXObjects[TXObjects.length - 1]) {
    currentStatus = TXObjects[TXObjects.length - 1];
    if (currentStatus.status === Status.SUCCESS) {
      currentStatus.successTitle = "Wallet created!";
      currentStatus.successSubtitle = `New DS wallet address: ${currentStatus.receipt.events.NewWallet.returnValues.proxy}`;
    }
  }
  return isZeroAddress(walletAddress) ? (
    <SpaceBetweenDiv noPadding>
      <Button size="small" onClick={createWallet}>
        Create wallet
      </Button>
      {currentStatus && <TransactionStatus currentStatus={currentStatus} />}
    </SpaceBetweenDiv>
  ) : (
    "Wallet"
  );
};

export default Wallet;
