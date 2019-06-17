import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'currency_pairs' })
export class CurrencyPairEntity {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column({ nullable: false })
  currencySell: string;

  @Column({ nullable: false })
  currencyBuy: string;

  @Column({ nullable: false, default: false })
  active: boolean;
}