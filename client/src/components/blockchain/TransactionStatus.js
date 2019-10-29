import React, { useEffect, useRef } from "react";
import { Pill, ToastMessage } from "rimble-ui";
import { TransactionStatus as Status } from "../../constants/TransactionStatusEnum";

const TransactionStatus = ({ currentStatus, onSuccess }) => {
  const toastRef = useRef(null);
  const { status } = currentStatus;
  useEffect(() => {
    const showToast = async () => {
      if (currentStatus.status === Status.SUCCESS && onSuccess) {
        await onSuccess();
      }
      toastRef.current.addMessage(...Status.getToastType(currentStatus));
    };
    showToast();
  }, [currentStatus, onSuccess]);
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
