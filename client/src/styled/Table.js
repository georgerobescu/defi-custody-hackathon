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

const FullWidth = styled.div`
  flex-grow: ${props => (props.fullWidth ? "1" : "")};
  margin: 32px ${props => (props.fullWidth ? "48px" : "")} 0px 0px;
`;

const Table = ({ title, children, fullWidth }) => (
  <FullWidth fullWidth={fullWidth}>
    {title && <StyledHeader>{title}</StyledHeader>}
    <StyledTable>{children}</StyledTable>
  </FullWidth>
);

export default Table;
