import React from "react";
import ReactDOM from "react-dom";
import { io } from "socket.io-client";
import "./style.css";

import { Transaction } from "./types";
import config from "./config";

interface State {
  transactions: Array<Transaction>;
}

function str2Txn(json: Record<string, any>): Transaction {
  return {
    fromAddr: json.fromAddr,
    toAddr: json.toAddr,
    amount: json.amount,
    timestamp: new Date(json.timestamp),
  };
}

class App extends React.Component<{}, State> {
  private socket = io(config.xcoin.url);

  constructor(props: {}) {
    super(props);
    this.state = {
      transactions: [],
    };
  }

  componentDidMount() {
    // Listen for messages
    const onTransaction = (tx: Transaction) => {
      const { transactions } = this.state;
      transactions.push(str2Txn(tx));
      this.setState({ transactions });
    };

    this.socket.on("transaction", onTransaction.bind(this));
    this.fetchData();
  }

  fetchData() {
    fetch(config.xcoin.url)
      .then((res) => res.json())
      .then((data) => {
        this.setState({ transactions: data.map(str2Txn) });
      });
  }

  render() {
    const Line = (props: { tx: Transaction }) => (
      <tr>
        <td className="center">{props.tx.timestamp.toLocaleString()}</td>
        <td>{props.tx.fromAddr}</td>
        <td>{props.tx.toAddr}</td>
        <td>{Number(props.tx.amount).toFixed(5)}</td>
      </tr>
    );

    return (
      <table>
        <thead>
          <tr>
            <td>Time</td>
            <td>From</td>
            <td>To</td>
            <td>Amount</td>
          </tr>
        </thead>
        <tbody>
          {this.state.transactions.map((tx, idx) => (
            <Line tx={tx} key={idx} />
          ))}
        </tbody>
      </table>
    );
  }
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
