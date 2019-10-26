import React, { useState } from "react";
import {
  CenteredTD,
  PercentageInput,
  SmallInput,
  Table
} from "../../../../styled";
import { Button } from "rimble-ui";
import { inject, observer } from "mobx-react";
import { compose } from "recompose";
import Address from "./Address";
import { toast } from "react-toastify";

const InteractionTable = ({ DSCStore }) => {
  const { tokens, addresses, setAddresses } = DSCStore;
  const changePercentage = (tokenIndex, address) => ({ target: { value } }) => {
    DSCStore.changePercentage(tokenIndex, address, value);
  };
  const updatePercentage = tokenIndex => () => {
    const sum = DSCStore.percentageSum(tokenIndex);
    if (sum !== 100) {
      toast.error(`Ooops, wrong percentage sum, ${sum}`);
      return;
    }
    DSCStore.updatePercentage(tokenIndex);
  };
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState("");
  const onChangeNewAddress = ({ target: { value } }) => setNewAddress(value);
  const addAddress = () => {
    setAddresses([...addresses, newAddress]);
    setNewAddress("");
    setIsAddingAddress(false);
  };
  const toggleAdding = () => {
    setIsAddingAddress(!isAddingAddress);
  };
  return (
    <Table title="Smart contract data">
      <thead>
        <tr>
          <th>Token name</th>
          <th>Amount</th>
          {addresses.map((address, i) => (
            <Address key={i} currentAddress={address} index={i} />
          ))}
          <th>
            {isAddingAddress && (
              <>
                <SmallInput
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
              disabled={!DSCStore.isInteractionAllowed}
            >
              Add
            </Button>
          </th>
        </tr>
      </thead>
      <tbody>
        {tokens.map((token, tokenIndex) => (
          <tr key={token.address + tokenIndex}>
            <CenteredTD>{token.name}</CenteredTD>
            <CenteredTD>{token.amount + " " + token.symbol}</CenteredTD>
            {addresses.map((address, i) => {
              const percent = token.percentage[address] || "";
              return (
                <CenteredTD key={i}>
                  <PercentageInput
                    disabled={token.amount === 0}
                    symbol="%"
                    value={percent}
                    type="number"
                    onChange={changePercentage(tokenIndex, address)}
                  />
                </CenteredTD>
              );
            })}
            <td>
              <Button
                iconpos="right"
                size="small"
                disabled={!DSCStore.isInteractionAllowed}
                onClick={updatePercentage(tokenIndex)}
              >
                Update
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default compose(
  inject("DSCStore"),
  observer
)(InteractionTable);
