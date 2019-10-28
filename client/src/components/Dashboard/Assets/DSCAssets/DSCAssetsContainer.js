import React from "react";
import { inject, observer } from "mobx-react";
import { compose } from "recompose";
import { CenteredTD, CenteredTH, Table } from "../../../../styled";
import { generateDicimaledBalance } from "../../../../utils/ethereum";
import DrizzleContainer from "../../../../drizzle/DrizzleContainer";
import TransferButtons from "./TransferButtons";
import TransferButtonsHookWrapper from "./TransferButtonsHookWrapper";

const DSCAssetsContainer = ({ DSCStore, Web3Store }) => {
  return (
    <>
      <Table
        title={DSCStore.drizzle ? "Wallet" : "Please connect to metamask."}
        fullWidth={true}
      >
        <thead>
          <tr>
            <CenteredTH>Asset</CenteredTH>
            <CenteredTH>Wallet Balance</CenteredTH>
            <th />
            <CenteredTH>Defi Custody Balance</CenteredTH>
          </tr>
        </thead>
        <tbody>
          {DSCStore.tokens.map((token, i) => (
            <tr key={token.address + i}>
              <CenteredTD>{token.name}</CenteredTD>
              <CenteredTD>
                {(token.balance
                  ? generateDicimaledBalance(
                      token.balance,
                      token.decimals,
                      Web3Store.web3.utils.toBN
                    )
                  : 0) +
                  " " +
                  token.symbol}
              </CenteredTD>
              <td>
                <DrizzleContainer
                  component={props => (
                    <TransferButtons token={token} {...props} />
                  )}
                  HooksWrapper={TransferButtonsHookWrapper}
                />
              </td>
              <CenteredTD>
                {(token.amount
                  ? generateDicimaledBalance(
                      token.amount,
                      token.decimals,
                      Web3Store.web3.utils.toBN
                    )
                  : 0) +
                  " " +
                  token.symbol}
              </CenteredTD>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default compose(
  inject("DSCStore", "Web3Store"),
  observer
)(DSCAssetsContainer);
