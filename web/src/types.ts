export interface NaiveTransaction {
  fromAddr: string;
  toAddr: string;
  amount: number;
}

export interface Transaction extends NaiveTransaction {
  timestamp: Date;
}

export interface Payout {
  address: string;
  amount: number;
}
