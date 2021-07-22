import express from "express";
import bodyParser from "body-parser";
import WebSocket from "ws";
import http from "http";
import _ from "lodash";

const app = express();
const server = http.createServer(app);
const port = 3000;
const wss = new WebSocket.Server({ server });

interface Transaction {
  fromAddr: string;
  toAddr: string;
  amount: string;
  time: Date;
}

const transactions: Array<Transaction> = [];
const wsClients: Array<WebSocket> = [];

wss.on("connection", (ws) => {
  console.log("Connected websocket client");
  wsClients.push(ws);
});

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.json(transactions);
});

app.post("/", (req, res) => {
  const tx: Transaction = _.defaults(req.body, { 
    fromAddr: "Genesis",
    time: new Date()
  });

  transactions.push(tx);
  _.forEach(wsClients, (ws) => ws.send(tx));
  res.json(tx);
});

app.listen(port, () => {
  console.log(`xcoin running on http://localhost:${port}`);
});
