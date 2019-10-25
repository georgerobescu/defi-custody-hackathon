export const generateDicimaledBalance = (balance, toBN) => {
  const divisor = toBN("10").pow(toBN(balance.decimals));
  const beforeDecimal = toBN(balance.amount)
    .div(divisor)
    .toString();
  let afterDecimal = toBN(balance.amount)
    .mod(divisor)
    .toString();
  if (afterDecimal.length < 2) {
    afterDecimal += "0";
  } else {
    while (
      afterDecimal.charAt(afterDecimal.length - 1) === "0" &&
      afterDecimal.length > 2
    ) {
      afterDecimal = afterDecimal.substring(0, afterDecimal.length - 1);
    }
  }
  const decimalBalance = beforeDecimal + "." + afterDecimal;
  return { ...balance, decimalBalance };
};

export const toShortAddress = address =>
  address
    ? address.substring(0, 6) + "..." + address.substring(address.length - 4)
    : "";

export const isZeroAddress = address =>
  address === "0x0000000000000000000000000000000000000000";
