import { useEffect, useState } from "react";
import { generateDicimaledBalance } from "../utils/ethereum";

const API_KEY = "UAK3dea068114955255b188b0cdfd12c9ae";
const RINKEBY_ID = "1b3f7a72b3e99c13";

const useBalances = (address, toBN) => {
  const [balances, setBalances] = useState();
  useEffect(() => {
    const fetchBalances = async () => {
      const response = await fetch(
        `https://cors-anywhere.herokuapp.com/https://web3api.io/api/v1/addresses/${address}/tokens`,
        {
          headers: {
            "x-api-key": API_KEY,
            "x-amberdata-blockchain-id": RINKEBY_ID
          }
        }
      );
      const result = await response.json();
      if (result.status === 200) {
        const {
          payload: { records }
        } = result;
        const balances = [];
        records.forEach(balance => {
          if (balance.isERC20) {
            balances.push(generateDicimaledBalance(balance, toBN));
          }
        });
        setBalances(balances);
      }
    };
    fetchBalances();
  }, [address, toBN]);
  return balances;
};

export default useBalances;
