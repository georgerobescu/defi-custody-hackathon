import React from "react";
import { CenteredTD, RightTD, Table } from "../../../styled";
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
      {DSCStore.tokens.map((token, i) => (
        <tr key={token.address + i}>
          <CenteredTD>{token.name}</CenteredTD>
          <CenteredTD>{token.earnings + " " + token.symbol}</CenteredTD>
        </tr>
      ))}
    </tbody>
  </Table>
);

export default compose(
  inject("DSCStore"),
  observer
)(Earnings);
