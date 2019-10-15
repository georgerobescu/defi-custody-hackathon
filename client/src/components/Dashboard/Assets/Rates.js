import React from "react";
import {
  FlexCenteredItem,
  SpaceBetweenDiv,
  StyledTable
} from "../../../styled";
import { Heading } from "rimble-ui";
import styled from "styled-components";
const dummyTokensRate = [
  { address: "0x1", name: "Ethereum", symbol: "ETH", rate: 0.29 },
  { address: "0x2", name: "DAI", symbol: "DAI", rate: 7.93 },
  { address: "0x3", name: "USD Coin", symbol: "USDC", rate: 4.56 }
];

const HeaderContainer = styled(FlexCenteredItem)`
  width: 360px;
`;
const NoPaddingDiv = styled(SpaceBetweenDiv)`
  flex-wrap: nowrap;
  padding: 0px;
`;

const Rates = () => (
  <NoPaddingDiv>
    <HeaderContainer noPadding={true}>
      <Heading.h4> Current ARY Interest Rate</Heading.h4>
    </HeaderContainer>
    <StyledTable>
      <thead>
        <tr>
          {dummyTokensRate.map(token => (
            <th key={token.address}>
              {`${token.name} (${token.symbol}) ${token.rate}%`}
            </th>
          ))}
        </tr>
      </thead>
    </StyledTable>
  </NoPaddingDiv>
);

export default Rates;
