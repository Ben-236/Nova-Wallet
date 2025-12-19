import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { FundWalletDto } from './dto/fund-wallet.dto';
import { TransferWalletDto } from './dto/transfer-wallet.dto';

@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Post()
  createWallet(@Body() dto: CreateWalletDto) {
    return this.walletsService.createWallet(dto.currency);
  }

  @Post(':id/fund')
  fundWallet(@Param('id') id: string, @Body() dto: FundWalletDto) {
    return this.walletsService.fundWallet(id, dto.amount, dto.requestId);
  }

  @Post('transfer')
  transfer(@Body() dto: TransferWalletDto) {
    // requestId for idempotency
    this.walletsService.transferFunds(
      dto.fromWalletId,
      dto.toWalletId,
      dto.amount,
      dto.requestId,
    );
    return { message: 'Transfer successful' };
  }

  @Get(':id')
  getWallet(@Param('id') id: string) {
    return this.walletsService.getWalletDetails(id);
  }
}
