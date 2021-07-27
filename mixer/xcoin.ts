import config from "./config";
import fetch, { Response } from "node-fetch";
import { Transaction, NaiveTransaction } from "./types";
import * as _ from "lodash";

async function $fetch(
  path: string,
  opts: Record<string, unknown> = {}
): Promise<Response> {
  const op = _.defaults(opts, {
    headers: { "Content-Type": "application/json" },
  });
  return fetch(`${config.xcoin.url}/${path}`, op);
}

const xcoin = {
  async list(address: string): Promise<Array<Transaction>> {
    return $fetch(address).then(async (res) => {
      const json = await res.json();
      return json.map((tx) => {
        tx.timestamp = new Date(tx.timestamp);
        tx.amount = parseFloat(tx.amount);
        return tx;
      });
    });
  },

  async send(fromAddr: string, toAddr: string, amount: number): Promise<void> {
    const txn: NaiveTransaction = {
      fromAddr,
      toAddr,
      amount,
    };

    if (config.debug) {
      console.log("Send: ", txn);
    }

    await $fetch("", {
      method: "post",
      body: JSON.stringify(txn),
    });
  },

  async pay(address: string, amount: number): Promise<void> {
    return this.send(config.mixer.address, address, amount);
  },
};

export default xcoin;
