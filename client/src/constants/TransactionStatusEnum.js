export const TransactionStatus = {
  PENDING: "pending",
  SUCCESS: "success",
  ERROR: "error",
  getColor: status => {
    switch (status) {
      case TransactionStatus.PENDING:
        return "primary";
      case TransactionStatus.SUCCESS:
        return "green";
      case TransactionStatus.ERROR:
        return "red";
      default:
        return null;
    }
  },
  getText: status => {
    switch (status) {
      case TransactionStatus.PENDING:
        return "Pending";
      case TransactionStatus.SUCCESS:
        return "Success";
      case TransactionStatus.ERROR:
        return "Error";
      default:
        return null;
    }
  },
  getToastType: ({ status, receipt, error, successTitle, successSubtitle }) => {
    switch (status) {
      case TransactionStatus.PENDING:
        return [
          "Transaction pending...",
          {
            secondaryMessage: "This might take a few minutes",
            variant: "processing"
          }
        ];
      case TransactionStatus.SUCCESS:
        return [
          successTitle,
          {
            secondaryMessage: successSubtitle,
            actionHref: `https://rinkeby.etherscan.io/tx/${receipt.transactionHash}`,
            actionText: "Check",
            variant: "success"
          }
        ];
      case TransactionStatus.ERROR:
        return [
          "Transaction failed",
          {
            secondaryMessage: error.message,
            variant: "failure"
          }
        ];
      default:
        return ["Processing payment...", { variant: "default" }];
    }
  }
};
