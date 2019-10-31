import React from "react";
import { InteractionTable } from "./InteractionTable";
import { CenteredDiv, ColumnDiv } from "../../../styled";
import ActionButtons from "./ActionButtons";
import DeadlineChooser from "./DeadlineChooser";
import { compose } from "recompose";

const SmartContractData = () => (
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

export default compose()(SmartContractData);