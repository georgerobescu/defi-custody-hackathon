import React from "react";
import { Table } from "../../../styled";
import { compose } from "recompose";
import { inject, observer } from "mobx-react";

const Earnings = ({ DSCStore }) => (
  <Table title="Interest Earned">
    <thead>
      <tr>
        <th>Token name</th>
        <th>Balance</th>
      </tr>
    </thead>
    <tbody>
      {DSCStore.tokens.map(token => (
        <tr key={token.address}>
          <td>{token.name}</td>
          <td>{token.earnings + " " + token.symbol}</td>
        </tr>
      ))}
    </tbody>
  </Table>
);

export default compose(
  inject("DSCStore"),
  observer
)(Earnings);
