import React from "react";
import { Button } from "rimble-ui";
import DrizzleContainer from "../../../../../drizzle/DrizzleContainer";
import UpdateWrapper from "./UpdateWrapper";

const UpdateButton = ({ tokenIndex }) => (
  <DrizzleContainer
    component={props => (
      <Button
        iconpos="right"
        size="small"
        disabled={props.disabled}
        onClick={() => props.signTransaction(tokenIndex)}
      >
        Update
      </Button>
    )}
    HooksWrapper={UpdateWrapper}
  />
);

export default UpdateButton;
