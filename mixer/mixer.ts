import config from "./config";
import xcoin from "./xcoin";
import MixRequest from "./mix-request";
import { Payout } from "./types";
import * as _ from "lodash";

export default class Mixer {
  private requests: Array<MixRequest> = [];
  private payouts: Array<Payout> = [];
  private batch: Array<Payout> = [];

  constructor() {
    this.createBatch();
    this.pay();
  }

  add(sender: string, recepients: Array<string>) {
    this.requests.push(new MixRequest(sender, recepients));
  }

  private async pay() {
    if (this.payouts.length > 0) {
      const po = this.payouts.shift();
      try {
        await xcoin.pay(po.address, po.amount);
        if (config.debug) {
          console.log("Pay: ", po);
        }
      } catch {
        this.payouts.push(po);
      }
    } else if (this.batch.length > 0) {
      this.payouts = this.batch;
      this.batch = [];
      if (config.debug) {
        console.log("New batch: ", this.payouts);
      }
    }

    setTimeout(
      this.pay.bind(this),
      Math.floor(Math.random() * config.mixer.payInterval)
    );
  }

  private createBatch() {
    if (this.requests.length > 0) {
      const [verified, pending] = _.partition(
        this.requests,
        (req) => req.amount != null
      );

      const batch: Array<Payout> = _.flatMap(verified, (req) => req.payouts);
      this.batch = _.chain(this.batch).concat(batch).shuffle().value();
      this.requests = pending;
    }

    setTimeout(this.createBatch.bind(this), config.mixer.batchInterval);
  }
}
