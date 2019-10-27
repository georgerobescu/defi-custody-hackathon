import React from "react";
import { CenteredTD, CenteredTH, Table } from "../../../../styled";
import { inject, observer } from "mobx-react";
import { compose } from "recompose";
import TransferButtons from "./TransferButtons";
import { generateDicimaledBalance } from "../../../../utils/ethereum";

const View = ({ DSCStore, wallet, Web3Store }) => {
  return (
    <Table title={wallet} fullWidth={true}>
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
              {token.balance
                ? generateDicimaledBalance(
                    token.balance,
                    token.decimals,
                    Web3Store.web3.utils.toBN
                  )
                : 0 + " " + token.symbol}
            </CenteredTD>
            <td>
              <TransferButtons token={token} />
            </td>
            <CenteredTD>
              {token.amount
                ? generateDicimaledBalance(
                    token.amount,
                    token.decimals,
                    Web3Store.web3.utils.toBN
                  )
                : 0 + " " + token.symbol}
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
)(View);
