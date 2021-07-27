import * as express from "express";
import * as bodyParser from "body-parser";
import * as _ from "lodash";

import { Transaction, NaiveTransaction } from "./types";
import config from "./config";
import Mixer from "./mixer";

const app = express();
app.use(bodyParser.json());

const mixer = new Mixer();

app.post("/", (req, res) => {
  const body = req.body as { sender: string; recepients: Array<string> };

  if (_.isNil(body.sender)) {
    return res.status(400).send("Invalid sender");
  }
  if (!_.isArray(body.recepients) || body.recepients.length == 0) {
    return res.status(400).send("Recepients must be an array");
  }

  mixer.add(body.sender, body.recepients);

  res.status(201).end();
});

app.listen(config.mixer.port, () =>
  console.log(`mixer runing on ${config.mixer.url}!`)
);
