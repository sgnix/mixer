import { Transaction } from "./types";
import * as _ from "lodash";

export function balance(ledger: Array<Transaction>, address: string): number {
  return _.reduce(
    ledger,
    (acc, tx) => {
      if (address == tx.fromAddr) {
        return acc - tx.amount;
      } else if (address = tx.toAddr) {
        return acc + tx.amount;
      }
    },
    0
  );
}
