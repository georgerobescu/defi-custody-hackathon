import React from "react";
import { Box, Input, Select } from "rimble-ui";
import { inject, observer } from "mobx-react";
import { compose } from "recompose";
import { DeadlineFormat } from "../../../constants/DeadlineTimeFormatEnum";

const DeadlineChooser = ({ DSCStore }) => (
  <Box my={3}>
    <Input
      type="number"
      disabled={DSCStore.hasNotToken}
      placeholder="Deadline in"
      value={(DSCStore.isInteractionAllowed && DSCStore.newDeadline) || ""}
      onChange={e => DSCStore.setDeadline(e.target.value)}
    />
    <Select
      disabled={DSCStore.hasNotToken}
      value={DSCStore.deadlineFormat}
      onChange={({ target: { value } }) => DSCStore.setDeadlineFormat(value)}
      options={[
        DeadlineFormat.SECONDS,
        DeadlineFormat.DAYS,
        DeadlineFormat.WEEKS,
        DeadlineFormat.MONTHS,
        DeadlineFormat.YEARS
      ].map(format => ({ value: format, label: format }))}
    />
  </Box>
);

export default compose(
  inject("DSCStore"),
  observer
)(DeadlineChooser);
