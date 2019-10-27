import React from "react";
import { CenteredTD, CenteredTH, Table } from "../../../styled";
import { compose } from "recompose";
import { inject, observer } from "mobx-react";

const Earnings = ({ DSCStore }) => (
  <Table title="Interest Earned">
    <thead>
      <tr>
        <CenteredTH>Token name</CenteredTH>
        <CenteredTH>Balance</CenteredTH>
      </tr>
    </thead>
    <tbody>
      {DSCStore.tokens.map((token, i) => (
        <tr key={token.address + i}>
          <CenteredTD>{token.name}</CenteredTD>
          <CenteredTD>{token.earnings || 0 + " " + token.symbol}</CenteredTD>
        </tr>
      ))}
    </tbody>
  </Table>
);

export default compose(
  inject("DSCStore"),
  observer
)(Earnings);
