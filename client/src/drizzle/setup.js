import { Drizzle, generateStore } from "drizzle";
import DeFiCustodyRegistry from "../../../build/contracts/DeFiCustodyRegistry";
import TestDAI from "../../../contracts/rayartifacts/TestDAI";
let drizzle;
const getDrizzleStore = () => {
  if (!drizzle) {
    const options = { contracts: [DeFiCustodyRegistry, TestDAI] };
    const drizzleStore = generateStore(options);
    drizzle = new Drizzle(options, drizzleStore);
  }
  return drizzle;
};
export default getDrizzleStore;
