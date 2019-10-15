import React, { useState } from "react";
import { OneRemInput, SmallInput, Table } from "../../../../styled";
import { Button } from "rimble-ui";
import { inject, observer } from "mobx-react";
import { compose } from "recompose";
import Address from "./Address";

const InteractionTable = ({ DSCStore }) => {
  const { tokens, addresses, setAddresses } = DSCStore;
  const changePercentage = (tokenIndex, address) => ({ target: { value } }) => {
    DSCStore.changePercentage(tokenIndex, address, value);
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
          <tr key={token.address}>
            <td>{token.name}</td>
            <td>{token.amount + " " + token.symbol}</td>
            {addresses.map((address, i) => {
              const percent = token.percentage[address] || "";
              return (
                <td key={i}>
                  <OneRemInput
                    disabled={DSCStore.tokens.length === 0}
                    value={percent}
                    type="number"
                    onChange={changePercentage(tokenIndex, address)}
                  />
                  %
                </td>
              );
            })}
            <td />
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
