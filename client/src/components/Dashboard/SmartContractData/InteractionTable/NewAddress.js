import React, { useState } from "react";
import {
  AddressInput,
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
    if (!Web3Store.web3.utils.isAddress(newAddress)) {
      setError("Wrong eth address format!");
      return;
    }
    if (addresses.includes(newAddress)) {
      setError("You can't add the same address twice");
      return;
    }
    setAddresses([...addresses, newAddress]);
    setNewAddress("");
    setIsAddingAddress(false);
  };
  const toggleAdding = () => {
    setIsAddingAddress(!isAddingAddress);
    setError();
  };
  return (
    <CenteredDiv alignItems="center" noWrap>
      {isAddingAddress && (
        <>
          {error && (
            <Tooltip message={error}>
              <Icon color="tomato" name="Error" />
            </Tooltip>
          )}
          <AddressInput
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
    </CenteredDiv>
  );
};

export default compose(
  inject("DSCStore", "Web3Store"),
  observer
)(NewAddress);
