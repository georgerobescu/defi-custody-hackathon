import React from "react";
import DSCAssets from "./DSCAssets";
import Earnings from "./Earnings";
import { SpaceBetweenDiv } from "../../../styled";

const Assets = () => (
  <SpaceBetweenDiv>
    <DSCAssets />
    <Earnings />
  </SpaceBetweenDiv>
);

export default Assets;
