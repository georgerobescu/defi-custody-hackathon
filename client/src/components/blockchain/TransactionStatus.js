import React, { useEffect, useRef } from "react";
import { Pill, ToastMessage } from "rimble-ui";
import { TransactionStatus as Status } from "../../constants/TransactionStatusEnum";

const TransactionStatus = ({ currentStatus }) => {
  const toastRef = useRef(null);
  const { status } = currentStatus;
  useEffect(() => {
    toastRef.current.addMessage(...Status.getToastType(currentStatus));
  }, [currentStatus]);
  return (
    <div>
      {status !== Status.SUCCESS && (
        <>
          Status:{" "}
          <Pill color={Status.getColor(status)}>{Status.getText(status)}</Pill>
        </>
      )}
      <ToastMessage.Provider delay={8000} ref={toastRef} />
    </div>
  );
};

export default TransactionStatus;
