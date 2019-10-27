import { Drizzle, generateStore } from "drizzle";
import DeFiCustodyRegistry from "../../../contracts/DeFiCustodyRegistry.sol";
import MockedERC20 from "../../../contracts/MockedERC20.sol";
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
