import { Drizzle, generateStore } from "drizzle";
import DeFiCustodyRegistry from "../../../contracts/DeFiCustodyRegistry.sol";
import FakeDAI from "../../../contracts/MockedERC20.sol";
let drizzle;
const getDrizzleStore = () => {
  if (!drizzle) {
    const options = { contracts: [DeFiCustodyRegistry, FakeDAI] };
    const drizzleStore = generateStore(options);
    drizzle = new Drizzle(options, drizzleStore);
  }
  return drizzle;
};
export default getDrizzleStore;
