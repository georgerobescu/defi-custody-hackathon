import React from "react";
import { FlexDiv } from "../../../styled";
import { Button } from "rimble-ui";
import { inject, observer } from "mobx-react";
import { compose } from "recompose";
import styled from "styled-components";
import { toast } from "react-toastify";
import UpdateWrapper from "./InteractionTable/UpdateButton/UpdateWrapper";
import DrizzleContainer from "../../../drizzle/DrizzleContainer";

const GrowButton = styled(Button)`
  flex-grow: 1;
  flex-basis: 0;
`;

const ActionButtons = ({ DSCStore, Web3Store, tokenIndex = 0 }) => (
  <FlexDiv noPadding={true}>
    <DrizzleContainer
      component={props => (
        <GrowButton
          disabled={props.disabled === undefined ? true : props.disabled}
          mr={2}
          onClick={() => props.signTransaction(tokenIndex)}
        >
          Sign
        </GrowButton>
      )}
      HooksWrapper={UpdateWrapper}
    />
    <GrowButton disabled={DSCStore.hasNotToken} ml={2}>
      Cancel
    </GrowButton>
  </FlexDiv>
);

export default compose(
  inject("DSCStore", "Web3Store"),
  observer
)(ActionButtons);
