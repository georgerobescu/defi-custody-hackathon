import React, { useState } from "react";
import { AddressHeader, SmallInput } from "../../../../styled";
import { Button } from "rimble-ui";
import { inject, observer } from "mobx-react";
import { compose } from "recompose";
import { toShortAddress } from "../../../../utils/ethereum";

const Address = ({ currentAddress, index, DSCStore }) => {
  const { addresses, setAddresses } = DSCStore;
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [address, setNewAddress] = useState(currentAddress || "");
  const onChangeNewAddress = ({ target: { value } }) => setNewAddress(value);
  const updateAddress = () => {
    addresses[index] = address;
    setAddresses([...addresses]);
    setIsAddingAddress(false);
  };
  const toggleAdding = () => {
    setIsAddingAddress(!isAddingAddress);
  };
  return (
    <th>
      {isAddingAddress ? (
        <>
          <SmallInput
            type="text"
            onChange={onChangeNewAddress}
            value={address}
            placeholder="0x00...?"
          />
          <Button.Outline size="small" mx={3} onClick={toggleAdding}>
            Cancel
          </Button.Outline>
          <Button
            size="small"
            onClick={updateAddress}
            disabled={!DSCStore.isInteractionAllowed}
          >
            Update
          </Button>
        </>
      ) : (
        <span onClick={toggleAdding}>
          <AddressHeader
            type="text"
            disabled={!currentAddress}
            defaultValue={toShortAddress(currentAddress)}
            placeholder="0x00...?"
          />
        </span>
      )}
    </th>
  );
};

export default compose(
  inject("DSCStore"),
  observer
)(Address);
