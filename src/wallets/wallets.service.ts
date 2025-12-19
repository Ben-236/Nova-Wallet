/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Wallet } from './interfaces/wallet.interface';
import { Transaction } from './interfaces/transaction.interface';
import { v4 as uuid } from 'uuid';

@Injectable()
export class WalletsService {
  private wallets = new Map<string, Wallet>();
  private transactions = new Map<string, Transaction[]>();
  private processedRequests = new Set<string>(); // Track processed requestIds

  createWallet(currency: string): Wallet {
    const wallet: Wallet = {
      id: uuid(),
      currency,
      balance: 0,
    };

    this.wallets.set(wallet.id, wallet);
    this.transactions.set(wallet.id, []);
    return wallet;
  }

  fundWallet(walletId: string, amount: number, requestId: string): Wallet {
    if (amount <= 0) {
      throw new BadRequestException('Amount must be positive');
    }

    // Idempotency check
    if (this.processedRequests.has(requestId)) {
      const wallet = this.wallets.get(walletId);
      if (!wallet) throw new NotFoundException('Wallet not found');
      return wallet; // Return without duplicating the fund
    }

    const wallet = this.wallets.get(walletId);
    if (!wallet) throw new NotFoundException('Wallet not found');

    wallet.balance += amount;

    const walletTransactions = this.transactions.get(walletId);
    if (!walletTransactions)
      throw new NotFoundException('Transaction history not found');

    walletTransactions.push({
      id: uuid(),
      type: 'FUND',
      amount,
      timestamp: new Date(),
    });

    this.processedRequests.add(requestId);

    return wallet;
  }

  transferFunds(
    fromId: string,
    toId: string,
    amount: number,
    requestId: string,
  ): void {
    if (amount <= 0) throw new BadRequestException('Amount must be positive');
    if (fromId === toId)
      throw new BadRequestException('Cannot transfer to the same wallet');

    // Idempotency check
    if (this.processedRequests.has(requestId)) return;

    const sender = this.wallets.get(fromId);
    const receiver = this.wallets.get(toId);

    if (!sender) throw new NotFoundException('Sender wallet not found');
    if (!receiver) throw new NotFoundException('Receiver wallet not found');
    if (sender.balance < amount) throw new BadRequestException('Insufficient balance');

    sender.balance -= amount;
    receiver.balance += amount;

    const transaction: Transaction = {
      id: uuid(),
      type: 'TRANSFER',
      amount,
      fromWalletId: fromId,
      toWalletId: toId,
      timestamp: new Date(),
    };

    const senderTransactions = this.transactions.get(fromId);
    const receiverTransactions = this.transactions.get(toId);

    if (!senderTransactions || !receiverTransactions) {
      throw new NotFoundException('Transaction history not found');
    }

    senderTransactions.push(transaction);
    receiverTransactions.push(transaction);

    this.processedRequests.add(requestId);
  }

  getWalletDetails(walletId: string): {
    wallet: Wallet;
    transactions: Transaction[];
  } {
    const wallet = this.wallets.get(walletId);
    if (!wallet) throw new NotFoundException('Wallet not found');

    const walletTransactions = this.transactions.get(walletId);
    if (!walletTransactions)
      throw new NotFoundException('Transaction history not found');

    return {
      wallet,
      transactions: walletTransactions,
    };
  }
}
