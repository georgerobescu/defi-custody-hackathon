import React, { useState } from "react";
import { TokenAmountInput } from "../../../../styled";
import { inject, observer } from "mobx-react";
import { compose } from "recompose";
import { Button, Flex } from "rimble-ui";
import {
  depositTokens,
  withdrawTokens
} from "../../../../blockchain/SmartContractCalls";
import { precision } from "../../../../utils/float";

const TransferButtons = ({ DSCStore, Web3Store, token }) => {
  const [transferAmount, setTransferAmount] = useState();
  const [isTransferring, setIsTransferring] = useState();
  const onChange = token => ({ target: { value } }) => {
    const max = Math.max(token.balance, token.amount);
    if (max < value) {
      value = max;
    }
    if (value < 0) {
      value = 0;
    }
    if (precision(value) > 6) {
      value = parseFloat(value).toFixed(6);
    }
    setTransferAmount(value);
  };
  const transfer = (token, transferTokens, isDeposit = true) => async () => {
    setIsTransferring(true);
    const amount = transferAmount * (isDeposit ? 1 : -1);
    await transferTokens(amount, token, DSCStore, Web3Store);
    DSCStore.transferTokens(token, amount);
    setTransferAmount(0);
    setIsTransferring(false);
  };
  return (
    <Flex>
      <TokenAmountInput
        disabled={isTransferring || (token.amount === 0 && token.balance === 0)}
        type="number"
        placeholder="Amount"
        value={
          (transferAmount !== undefined && transferAmount.toString()) || ""
        }
        onChange={onChange(token)}
        symbol={token.symbol}
      />
      <Button
        size="small"
        mx={3}
        onClick={transfer(token, withdrawTokens, false)}
        disabled={
          !transferAmount || isTransferring || token.amount < transferAmount
        }
      >
        Withdraw
      </Button>
      <Button
        size="small"
        mx={3}
        onClick={transfer(token, depositTokens)}
        disabled={
          !transferAmount || isTransferring || token.balance < transferAmount
        }
      >
        Deposit
      </Button>
    </Flex>
  );
};

export default compose(
  inject("DSCStore", "Web3Store"),
  observer
)(TransferButtons);
