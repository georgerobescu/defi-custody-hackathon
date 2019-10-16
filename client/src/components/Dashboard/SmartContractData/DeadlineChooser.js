import React from "react";
import { Box, Input, Select } from "rimble-ui";
import { inject, observer } from "mobx-react";
import { compose } from "recompose";

const DeadlineChooser = ({ DSCStore }) => (
  <Box my={3}>
    <Input
      type="number"
      disabled={!DSCStore.isInteractionAllowed}
      placeholder="Deadline in"
    />
    <Select
      disabled={!DSCStore.isInteractionAllowed}
      options={[
        { value: "years", label: "Years" },
        { value: "months", label: "Months" },
        { value: "weeks", label: "Weeks" },
        { value: "days", label: "Days" }
      ]}
    />
  </Box>
);

export default compose(
  inject("DSCStore"),
  observer
)(DeadlineChooser);
