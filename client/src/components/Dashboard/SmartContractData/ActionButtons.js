import React from "react";
import { FlexDiv } from "../../../styled";
import { Button } from "rimble-ui";
import { inject, observer } from "mobx-react";
import { compose } from "recompose";
import styled from "styled-components";

const GrowButton = styled(Button)`
  flex-grow: 1;
  flex-basis: 0;
`;

const ActionButtons = ({ DSCStore, Web3Store }) => (
  <FlexDiv noPadding={true}>
    <GrowButton
      onClick={() => DSCStore.setRecoverySheet(0, Web3Store.web3.utils.toWei)}
      disabled={DSCStore.tokens.length === 0}
      mr={2}
    >
      Sign
    </GrowButton>
    <GrowButton disabled={DSCStore.tokens.length === 0} ml={2}>
      Cancel
    </GrowButton>
  </FlexDiv>
);

export default compose(
  inject("DSCStore", "Web3Store"),
  observer
)(ActionButtons);
