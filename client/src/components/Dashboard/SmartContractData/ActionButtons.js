import React from "react";
import { FlexDiv } from "../../../styled";
import { Button } from "rimble-ui";
import { inject, observer } from "mobx-react";
import { compose } from "recompose";
import styled from "styled-components";

const EqualButtons = styled(Button)`
  flex-grow: 1;
  flex-basis: 0;
`;

const ActionButtons = ({ DSCStore }) => (
  <FlexDiv noPadding={true}>
    <EqualButtons disabled={DSCStore.tokens.length === 0} mr={2}>
      Sign
    </EqualButtons>
    <EqualButtons disabled={DSCStore.tokens.length === 0} ml={2}>
      Cancel
    </EqualButtons>
  </FlexDiv>
);

export default compose(
  inject("DSCStore"),
  observer
)(ActionButtons);
