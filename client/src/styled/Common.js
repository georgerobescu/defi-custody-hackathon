import React from "react";
import { Input } from "rimble-ui";
import styled from "styled-components";

const SmallInput = styled(Input)`
  height: 2rem;
`;

const FlexCenteredItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0px;
`;

const AddressHeader = styled(SmallInput)`
  padding: 8px;
  max-width: 120px;
`;

const TokenAmountInput = styled(SmallInput)`
  border: none;
  max-width: 160px;
`;

const OneRemInput = styled(Input)`
  height: 1rem;
  border: 0px;
  max-width: 80px;
`;

const FlexDiv = styled.div`
  display: flex;
  padding: 0px ${props => (props.noPadding ? "" : "24px")};
  flex-wrap: wrap;
`;

const SpaceBetweenDiv = styled(FlexDiv)`
  justify-content: space-between;
`;

const EndDiv = styled(FlexDiv)`
  justify-content: flex-end;
`;

const CenteredDiv = styled(FlexDiv)`
  justify-content: center;
`;

const ColumnDiv = styled(FlexDiv)`
  flex-direction: column;
`;

export {
  SmallInput,
  OneRemInput,
  SpaceBetweenDiv,
  CenteredDiv,
  FlexDiv,
  ColumnDiv,
  TokenAmountInput,
  EndDiv,
  AddressHeader,
  FlexCenteredItem
};
