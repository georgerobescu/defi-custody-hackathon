import React, { useState } from "react";
import { Table, TokenAmountInput } from "../../../styled";
import { inject, observer } from "mobx-react";
import { compose } from "recompose";
import { Button } from "rimble-ui";

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
        {DSCStore.tokens.map(token => (
          <tr key={token.address}>
            <td>{`${token.name}`}</td>
            <td>{token.balance + " " + token.symbol}</td>
            <td>
              <TokenAmountInput
                disabled={isTransferring}
                type="number"
                value={transferAmount || ""}
                onChange={onChange(token)}
              />
              {token.symbol}
              <Button
                size="small"
                mx={3}
                onClick={transferTokens(token)}
                disabled={isTransferring || !transferAmount}
              >
                Transfer
              </Button>
            </td>
            <td>{token.amount + " " + token.symbol}</td>
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
