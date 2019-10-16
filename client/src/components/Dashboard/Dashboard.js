import React, { useEffect } from "react";
import { compose } from "recompose";
import { inject, observer } from "mobx-react";
import styled from "styled-components";
import Assets from "./Assets";
import SmartContractData from "./SmartContractData";
import MetamaskConnection from "./MetamaskConnection";
import { fetchTokens } from "../../blockchain";
import Rates from "./Assets/Rates";
import { ColumnDiv, FlexCenteredItem } from "../../styled";

const CenteredColumns = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Dashboard = ({ Web3Store, DSCStore }) => {
  useEffect(() => {
    if (!Web3Store.loading) {
      fetchTokens(DSCStore);
    }
  }, [DSCStore, Web3Store.loading]);
  return (
    <>
      <CenteredColumns>
        <ColumnDiv>
          <FlexCenteredItem>
            <Rates />
            <MetamaskConnection />
          </FlexCenteredItem>
          <Assets />
          <SmartContractData />
        </ColumnDiv>
      </CenteredColumns>
    </>
  );
};

export default compose(
  inject("Web3Store", "DSCStore"),
  observer
)(Dashboard);
