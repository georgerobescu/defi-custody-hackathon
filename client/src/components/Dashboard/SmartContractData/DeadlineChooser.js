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
      value={DSCStore.isInteractionAllowed && DSCStore.newDeadline}
      onChange={e => DSCStore.setDeadline(e.target.value)}
    />
    <Select
      disabled={!DSCStore.isInteractionAllowed}
      options={[
        { value: "seconds", label: "Seconds" },
        { value: "days", label: "Days" },
        { value: "weeks", label: "Weeks" },
        { value: "months", label: "Months" },
        { value: "years", label: "Years" }
      ]}
    />
  </Box>
);

export default compose(
  inject("DSCStore"),
  observer
)(DeadlineChooser);
