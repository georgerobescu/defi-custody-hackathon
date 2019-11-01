import React, { useEffect, useRef } from "react";
import { Pill, ToastMessage } from "rimble-ui";
import { TransactionStatus as Status } from "../../constants/TransactionStatusEnum";

const TransactionStatus = ({ currentStatus, getStatus }) => {
  const toastRef = useRef(null);
  const { status } = currentStatus;
  useEffect(() => {
    const showToast = async () => {
      let status = currentStatus;
      if (getStatus) {
        status = await getStatus(currentStatus);
      }
      toastRef.current.addMessage(...Status.getToastType(status));
    };
    showToast();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
