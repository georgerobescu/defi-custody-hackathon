import React from "react";
import { Heading } from "rimble-ui";
import { toShortAddress } from "../utils/ethereum";

const EthAddress = ({ address }) => (
  <Heading.h4>{toShortAddress(address)}</Heading.h4>
);

export default EthAddress;
