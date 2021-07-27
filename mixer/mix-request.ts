import config from "./config";
import xcoin from "./xcoin";
import * as _ from "lodash";
import { Payout } from "./types";
import { shard } from "./util";

export default class MixRequest {
  public timestamp = new Date();
  public values: Array<number> = [];
  public _amount: number | null = null;

  constructor(public sender: string, public recepients: Array<string>) {
    if (config.debug) {
      console.log(`Request ${this.sender} -> ${this.recepients}`);
    }
    this.verify(config.verify.tries);
  }

  set amount(x: number | null) {
    this._amount = x;
    this.values = x == null ? [] : shard(x, this.recepients.length);
  }

  get amount(): number | null {
    return this._amount;
  }

  get payouts(): Array<Payout> {
    return _.zipWith(this.recepients, this.values, (address, amount) => ({
      address,
      amount,
    }));
  }

  private async verify(tries: number): Promise<void> {
    if (tries <= 0) {
      if (config.debug) {
        console.log(`Unabled to verify ${this.sender}`);
      }
      return;
    }

    const retry = () => {
      const t = tries - 1;
      if (config.debug) {
        console.log(`Verify timeout (${t}): ${this.sender}`);
      }
      this.verify(t);
    };

    try {
      const transactions = await xcoin.list(config.mixer.address);
      const found = _.find(
        transactions,
        (txn) => txn.fromAddr == this.sender && txn.timestamp > this.timestamp
      );

      if (found) {
        this.amount = found.amount * (1 - config.mixer.commission);
        if (config.debug) {
          console.log(`Verified: ${this.sender} at ${found.amount}`);
          console.log(`Commission: ${found.amount * config.mixer.commission}`);
        }
      } else {
        setTimeout(retry.bind(this), config.verify.timeout);
      }
    } catch (e) {
      console.error(e);
      setTimeout(retry.bind(this), config.verify.timeout);
    }
  }
}
