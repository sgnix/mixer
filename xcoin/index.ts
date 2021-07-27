import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import * as _ from "lodash";

import { Transaction } from "./types";
import config from "./config";

const app = express();
const httpServer = createServer(app);

const ledger: Array<Transaction> = [];
const clients: Array<Socket> = [];

const io = new Server(httpServer, {
  cors: {
    origin: config.web.url,
    methods: ["GET", "POST"],
  },
});
io.on("connection", (ws) => clients.push(ws));

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.json(ledger);
});

app.get("/:address", (req, res) => {
  res.json(_.filter(ledger, (tx) => tx.toAddr == req.params.address));
});

app.post("/", (req, res) => {
  if (config.debug) {
    console.log("POST: ", req.body);
  }

  const tx: Transaction = _.defaults(req.body, {
    fromAddr: "Genesis",
    timestamp: new Date(),
  } as Partial<Transaction>);

  ledger.push(tx);
  _.forEach(clients, (ws) => ws.emit("transaction", tx));

  res.status(201).end();
});

// HTTP Server
httpServer.listen(config.xcoin.port, () => {
  console.log(`xcoin running on ${config.xcoin.url}`);
});
