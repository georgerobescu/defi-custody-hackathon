import React, { useEffect, useState } from "react";
import { CenteredTD, Table } from "../../../styled";
import { inject, observer } from "mobx-react";
import { compose } from "recompose";
import TransferButtons from "./TransferButtons";
import { drizzleReactHooks } from "../../../drizzle";
const DSCAssets = ({ DSCStore }) => {
  const [walletAddress, setWalletAddress] = useState();
  const drizzleState = drizzleReactHooks.useDrizzleState(drizzleState => ({
    drizzleStatus: drizzleState.drizzleStatus
  }));
  useEffect(() => {
    if (drizzleState.notConnected) {
      return;
    }
    setWalletAddress("hi");
  }, [drizzleState]);
  console.log(drizzleState);
  console.log(walletAddress);
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
            <CenteredTD>{token.name}</CenteredTD>
            <CenteredTD>{token.balance + " " + token.symbol}</CenteredTD>
            <td>
              <TransferButtons token={token} />
            </td>
            <CenteredTD>{token.amount + " " + token.symbol}</CenteredTD>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default compose(
  inject("DSCStore"),
  observer
)(DSCAssets);
