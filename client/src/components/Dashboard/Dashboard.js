import React from "react";
import styled from "styled-components";
import Assets from "./Assets";
import SmartContractData from "./SmartContractData";
import MetamaskConnection from "./MetamaskConnection";
import Rates from "./Assets/Rates";
import { ColumnDiv, FlexCenteredItem } from "../../styled";
import withDrizzle from "../../drizzle/WithDrizzle";
import Spinner from "../utils/Spinner";
import { compose } from "recompose";
import { inject, observer } from "mobx-react";
import AssetsObserver from "./AssetsObserver";

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
const Dashboard = ({ BlockchainStatusStore }) => {
  return (
    <CenteredColumns>
      <ColumnDiv>
        <FlexCenteredItem>
          <Rates />
          <MetamaskConnection />
        </FlexCenteredItem>
        {BlockchainStatusStore.metamaskLoading ? (
          <Spinner />
        ) : (
          <AssetsObserver>
            <Drizzled />
          </AssetsObserver>
        )}
      </ColumnDiv>
    </CenteredColumns>
  );
};

export default compose(
  inject("BlockchainStatusStore"),
  observer
)(Dashboard);
