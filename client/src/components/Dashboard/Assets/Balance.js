import React from "react";
import { compose } from "recompose";
import { inject, observer } from "mobx-react";
import useBalances from "../../../hooks/UseBalances";
import { Table } from "../../../styled";

const Balance = ({ Web3Store }) => {
  const balances = useBalances(
    Web3Store.defaultAccount,
    Web3Store.web3.utils.toBN
  );
  return balances ? (
    <Table title="Balances">
      <thead>
        <tr>
          <th>Token name</th>
          <th>Balance</th>
        </tr>
      </thead>
      <tbody>
        {balances.map(balance => (
          <tr key={balance.address}>
            <td>{balance.name}</td>
            <td>{balance.decimalBalance + " " + balance.symbol}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  ) : null;
};

export default compose(
  inject("Web3Store"),
  observer
)(Balance);
