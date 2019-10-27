import React, { useState } from "react";
import {
  CenteredTD,
  CenteredTH,
  PercentageInput,
  SmallInput,
  Table
} from "../../../../styled";
import { Button } from "rimble-ui";
import { inject, observer } from "mobx-react";
import { compose } from "recompose";
import Address from "./Address";
import { toast } from "react-toastify";
import { generateDicimaledBalance } from "../../../../utils/ethereum";

const InteractionTable = ({ DSCStore, Web3Store }) => {
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
          <CenteredTH>Token name</CenteredTH>
          <CenteredTH>Amount</CenteredTH>
          {addresses.map((address, i) => (
            <Address key={i} currentAddress={address} index={i} />
          ))}
          <CenteredTH>
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
          </CenteredTH>
        </tr>
      </thead>
      <tbody>
        {tokens.map((token, tokenIndex) => (
          <tr key={token.address + tokenIndex}>
            <CenteredTD>{token.name}</CenteredTD>
            <CenteredTD>
              {token.amount
                ? generateDicimaledBalance(
                    token.amount,
                    token.decimals,
                    Web3Store.web3.utils.toBN
                  )
                : 0 + " " + token.symbol}
            </CenteredTD>
            {addresses.map((address, i) => {
              const percent = token.percentage ? token.percentage[address] : "";
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
            <CenteredTD>
              <Button
                iconpos="right"
                size="small"
                disabled={!DSCStore.isInteractionAllowed}
                onClick={updatePercentage(tokenIndex)}
              >
                Update
              </Button>
            </CenteredTD>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default compose(
  inject("DSCStore", "Web3Store"),
  observer
)(InteractionTable);
