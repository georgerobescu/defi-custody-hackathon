import React, { useState } from "react";
import {
  CenteredDiv,
  FlexCenteredItem,
  FlexDiv,
  SmallInput
} from "../../../../styled";
import { Button, Icon, Tooltip } from "rimble-ui";
import { inject, observer } from "mobx-react";
import { compose } from "recompose";

const NewAddress = ({ DSCStore, Web3Store }) => {
  const { addresses, setAddresses } = DSCStore;
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [error, setError] = useState();
  const [newAddress, setNewAddress] = useState("");
  const onChangeNewAddress = ({ target: { value } }) => {
    setNewAddress(value);
    if (error && Web3Store.web3.utils.isAddress(value)) {
      setError();
    }
  };
  const addAddress = () => {
    if (Web3Store.web3.utils.isAddress(newAddress)) {
      setAddresses([...addresses, newAddress]);
      setNewAddress("");
      setIsAddingAddress(false);
    } else {
      setError("Wrong eth address format!");
    }
  };
  const toggleAdding = () => {
    setIsAddingAddress(!isAddingAddress);
    setError();
  };
  return (
    <FlexCenteredItem>
      {isAddingAddress && (
        <>
          {error && (
            <Tooltip message={error}>
              <Icon color="tomato" name="Error" />
            </Tooltip>
          )}
          <SmallInput
            error={!!error}
            type="text"
            onChange={onChangeNewAddress}
            value={newAddress}
            placeholder="0x00...?"
          />
          <Button.Outline size="small" mx={3} onClick={toggleAdding}>
            Cancel
          </Button.Outline>
        </>
      )}
      <Button
        icon={!isAddingAddress && "Add"}
        iconpos="right"
        size="small"
        onClick={isAddingAddress ? addAddress : toggleAdding}
        disabled={DSCStore.hasNotToken}
      >
        Add
      </Button>
    </FlexCenteredItem>
  );
};

export default compose(
  inject("DSCStore", "Web3Store"),
  observer
)(NewAddress);
