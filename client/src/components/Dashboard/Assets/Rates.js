import React from "react";
import { CenteredTD, CenteredTH, StyledTable } from "../../../styled";
import Table from "../../../styled/Table";

const dummyTokensRate = [
  { address: "0x1", name: "Ethereum", symbol: "ETH", rate: 0.29 },
  { address: "0x2", name: "DAI", symbol: "DAI", rate: 7.93 },
  { address: "0x3", name: "USD Coin", symbol: "USDC", rate: 4.56 }
];

const Rates = () => (
  <Table fullWidth={true}>
    <thead>
      <tr>
        <th />
        <CenteredTH>Current ARY Interest Rate</CenteredTH>
        <th />
      </tr>
    </thead>
    <tbody>
      <tr>
        {dummyTokensRate.map(token => (
          <CenteredTD key={token.address}>
            {`${token.name} (${token.symbol}) ${token.rate}%`}
          </CenteredTD>
        ))}
      </tr>
    </tbody>
  </Table>
);

export default Rates;
