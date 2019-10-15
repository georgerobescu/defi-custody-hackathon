import React from "react";
import { Input } from "rimble-ui";
import styled from "styled-components";

const SmallInput = styled(Input)`
  height: 2rem;
  border: none;
  border-radius: 4px 0px 0px 4px;
  box-shadow: none;
  ::placeholder {
    color: rgb(117, 117, 117);
    opacity: ${props => (props.disabled ? "1" : "0.4")};
  }
`;
const OneRemInput = styled(SmallInput)`
  height: 1rem;
  max-width: 80px;
`;
const FlexCenteredItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0px 24px;
`;

const AddressHeader = styled(SmallInput)`
  padding: 8px;
  max-width: 120px;
`;

const TokenAmount = styled(SmallInput)`
  max-width: 160px;
`;
const BorderedDiv = styled.div`
  border: 1px solid #ddd;
  border-radius: 4px;
  display: flex;
  align-items: center;
`;

const Symbol = styled.div`
  width: 40px;
  padding-left: 4px;
`;

const InputWithSymbol = Input => ({ symbol, ...rest }) => (
  <BorderedDiv>
    <Input {...rest} />
    <Symbol>{symbol}</Symbol>
  </BorderedDiv>
);

const TokenAmountInput = InputWithSymbol(TokenAmount);

const PercentageInput = InputWithSymbol(OneRemInput);

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

const MetamaskContainer = styled.div`
  width: 270px;
  display: flex;
  justify-content: center;
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
  FlexCenteredItem,
  PercentageInput,
  MetamaskContainer
};
