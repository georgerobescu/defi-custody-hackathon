import React from "react";
import { inject, observer } from "mobx-react";
import { compose } from "recompose";
import TransactionStatus from "../components/blockchain";
import { TransactionStatus as Status } from "../constants/TransactionStatusEnum";

const TransactionWrapper = props => {
  const { Component, TXObjects, successToast, ...rest } = props;
  let currentStatus;
  if (TXObjects.length > 0 && TXObjects[TXObjects.length - 1]) {
    currentStatus = TXObjects[TXObjects.length - 1];
    if (currentStatus.status === Status.SUCCESS) {
      currentStatus.successTitle = successToast.successTitle;
      currentStatus.successSubtitle = successToast.successSubtitle(
        currentStatus.receipt
      );
    }
  }
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
