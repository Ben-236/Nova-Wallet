export interface Transaction {
  id: string;
  type: 'FUND' | 'TRANSFER';
  amount: number;
  fromWalletId?: string;
  toWalletId?: string;
  timestamp: Date;
}
