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

  fundWallet(walletId: string, amount: number): Wallet {
    const wallet = this.wallets.get(walletId);
    if (!wallet) throw new NotFoundException('Wallet not found');

    wallet.balance += amount;

    this.transactions.get(walletId)?.push({
      id: uuid(),
      type: 'FUND',
      amount,
      timestamp: new Date(),
    });

    return wallet;
  }

  transferFunds(fromId: string, toId: string, amount: number): void {
    if (fromId === toId) {
      throw new BadRequestException('Cannot transfer to the same wallet');
    }

    const sender = this.wallets.get(fromId);
    const receiver = this.wallets.get(toId);

    if (!sender || !receiver) {
      throw new NotFoundException('Sender or receiver wallet not found');
    }

    if (sender.balance < amount) {
      throw new BadRequestException('Insufficient balance');
    }

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

    this.transactions.get(fromId)?.push(transaction);
    this.transactions.get(toId)?.push(transaction);
  }

  getWalletDetails(walletId: string) {
    const wallet = this.wallets.get(walletId);
    if (!wallet) throw new NotFoundException('Wallet not found');

    return {
      wallet,
      transactions: this.transactions.get(walletId),
    };
  }
}
