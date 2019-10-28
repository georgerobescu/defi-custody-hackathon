import React from "react";
import { inject, observer } from "mobx-react";
import { compose } from "recompose";
import TransactionStatus from "../components/blockchain";

const TransactionWrapper = props => {
  const { Component, currentStatus, ...rest } = props;
  return (
    <>
      {Component(rest)}
      {currentStatus && <TransactionStatus currentStatus={currentStatus} />}
    </>
  );
};

const DrizzleContainer = props => {
  const { DSCStore, component, HooksWrapper } = props;
  return DSCStore.drizzle ? (
    <HooksWrapper>
      {parentProps => (
        <TransactionWrapper Component={component} {...parentProps} />
      )}
    </HooksWrapper>
  ) : (
    component({ DSCStore })
  );
};

export default compose(
  inject("DSCStore"),
  observer
)(DrizzleContainer);
