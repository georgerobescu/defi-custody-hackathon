import React, { useState } from "react";
import { CenteredTD, FlexDiv, Table, TokenAmountInput } from "../../../styled";
import { inject, observer } from "mobx-react";
import { compose } from "recompose";
import { Button, Flex } from "rimble-ui";

const DSCAssets = ({ DSCStore, Web3Store }) => {
  const [transferAmount, setTransferAmount] = useState();
  const [isTransferring, setIsTransferring] = useState();
  const onChange = token => ({ target: { value } }) => {
    value = parseFloat(value);
    if (token.balance < value) {
      value = token.balance;
    }
    if (value < 0) {
      value = 0;
    }
    setTransferAmount(value);
  };
  const transferTokens = token => async () => {
    setIsTransferring(true);
    await transferTokens(Web3Store.web3, transferAmount, token);
    DSCStore.transferTokens(token, transferAmount);
    setIsTransferring(false);
  };
  return (
    <Table title="Wallet" fullWidth={true}>
      <thead>
        <tr>
          <th>Asset</th>
          <th>Wallet Balance</th>
          <th />
          <th>Defi Custody Balance</th>
        </tr>
      </thead>
      <tbody>
        {DSCStore.tokens.map((token, i) => (
          <tr key={token.address + i}>
            <CenteredTD>{`${token.name}`}</CenteredTD>
            <CenteredTD>{token.balance + " " + token.symbol}</CenteredTD>
            <td>
              <Flex>
                <TokenAmountInput
                  disabled={isTransferring || token.amount === 0}
                  type="number"
                  placeholder="Amount"
                  value={transferAmount || ""}
                  onChange={onChange(token)}
                  symbol={token.symbol}
                />
                <Button
                  size="small"
                  mx={3}
                  onClick={transferTokens(token)}
                  disabled={isTransferring || !transferAmount}
                >
                  Transfer
                </Button>
              </Flex>
            </td>
            <CenteredTD>{token.amount + " " + token.symbol}</CenteredTD>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default compose(
  inject("DSCStore", "Web3Store"),
  observer
)(DSCAssets);
