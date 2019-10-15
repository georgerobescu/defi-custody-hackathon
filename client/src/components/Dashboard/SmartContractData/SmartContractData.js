import React from "react";
import { InteractionTable } from "./InteractionTable";
import { CenteredDiv, ColumnDiv } from "../../../styled";
import ActionButtons from "./ActionButtons";
import DeadlineChooser from "./DeadlineChooser";
import { compose } from "recompose";
import { inject, observer } from "mobx-react";
import Spinner from "../../utils/Spinner";

const SmartContractData = ({ DSCStore }) => {
  if (!DSCStore.isFetched) {
    return <Spinner />;
  }
  return (
    <ColumnDiv>
      <InteractionTable />
      <CenteredDiv>
        <ColumnDiv>
          <DeadlineChooser />
          <ActionButtons />
        </ColumnDiv>
      </CenteredDiv>
    </ColumnDiv>
  );
};

export default compose(
  inject("DSCStore"),
  observer
)(SmartContractData);
