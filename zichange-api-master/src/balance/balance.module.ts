import { Module } from '@nestjs/common';
import { BalanceRepository } from './service/balance.repository';

@Module({
  imports: [ ],
  providers: [ BalanceRepository ],
  controllers: [ ],
  exports: [ BalanceRepository ],
})
export class BalanceModule { }