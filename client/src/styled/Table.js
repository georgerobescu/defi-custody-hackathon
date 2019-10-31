import React from "react";
import { Heading, Table as RimbleTable } from "rimble-ui";
import styled from "styled-components";

export const StyledTable = styled(RimbleTable)`
  font-size: 12px;
  margin: 16px 0px;
`;

const StyledHeader = styled(Heading.h3)`
  margin: 16px 0px;
`;

export const CenteredTD = styled.td`
  text-align: center !important;
`;

export const RightTD = styled.td`
  text-align: right !important;
`;

export const CenteredTH = styled.th`
  text-align: center !important;
`;

const FullWidth = styled.div`
  flex-grow: ${props => (props.fullWidth ? "1" : "")};
  margin: 12px ${props => (props.fullWidth ? "48px" : "")} 0px 0px;
`;

const Table = ({ title, children, fullWidth }) => (
  <FullWidth fullWidth={fullWidth}>
    {title && <StyledHeader>{title}</StyledHeader>}
    <StyledTable>{children}</StyledTable>
  </FullWidth>
);

export default Table;
