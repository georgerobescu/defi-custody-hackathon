import { Drizzle, generateStore } from "drizzle";
import SimpleStorage from "../../../contracts/DeFiCustodyRegistry.sol";
let drizzle;
const getDrizzleStore = () => {
  if (!drizzle) {
    const options = { contracts: [SimpleStorage] };
    const drizzleStore = generateStore(options);
    drizzle = new Drizzle(options, drizzleStore);
  }
  return drizzle;
};
export default getDrizzleStore;
