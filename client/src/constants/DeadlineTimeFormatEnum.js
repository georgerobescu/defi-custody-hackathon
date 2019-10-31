export const DeadlineFormat = {
  SECONDS: "Seconds",
  DAYS: "Days",
  WEEKS: "Weeks",
  MONTHS: "Months",
  YEARS: "Years",
  getTime: (amount, status) => {
    switch (status) {
      case DeadlineFormat.SECONDS:
        return amount;
      case DeadlineFormat.DAYS:
        return amount * 60 * 60 * 24;
      case DeadlineFormat.WEEKS:
        return amount * 60 * 60 * 24 * 7;
      case DeadlineFormat.MONTHS:
        return amount * 60 * 60 * 24 * 7 * 30;
      case DeadlineFormat.YEARS:
        return amount * 60 * 60 * 24 * 7 * 30 * 365;
      default:
        return 0;
    }
  }
};
