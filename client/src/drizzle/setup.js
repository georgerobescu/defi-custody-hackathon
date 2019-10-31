import { Drizzle, generateStore } from "drizzle";
import DeFiCustodyRegistry from "../../../build/contracts/DeFiCustodyRegistry";
import MockedERC20 from "../../../build/contracts/MockedERC20";
let drizzle;
const getDrizzleStore = () => {
  if (!drizzle) {
    const options = { contracts: [DeFiCustodyRegistry, MockedERC20] };
    const drizzleStore = generateStore(options);
    drizzle = new Drizzle(options, drizzleStore);
  }
  return drizzle;
};
export default getDrizzleStore;
