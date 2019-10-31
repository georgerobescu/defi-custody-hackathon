
import React from "react";
import styled from "styled-components";
import Assets from "./Assets";
import SmartContractData from "./SmartContractData";
import MetamaskConnection from "./MetamaskConnection";
import Rates from "./Assets/Rates";
import { ColumnDiv, FlexCenteredItem } from "../../styled";
import withDrizzle from "../../drizzle/WithDrizzle";

const CenteredColumns = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Drizzled = withDrizzle(() => (
  <>
    <Assets />
    <SmartContractData />
  </>
));
const Dashboard = () => {
  return (
    <CenteredColumns>
      <ColumnDiv>
        <FlexCenteredItem>
          <Rates />
          <MetamaskConnection />
        </FlexCenteredItem>
        <Drizzled />
      </ColumnDiv>
    </CenteredColumns>
  );
};

export default Dashboard;