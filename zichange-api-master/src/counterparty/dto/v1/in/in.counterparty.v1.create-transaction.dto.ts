import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Validate } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
import { IsCorrectNumber } from '../../../../core/util/is-correct-number.validator';

export class InCounterpartyV1CreateTransactionDTO {
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  @ApiModelProperty()
  email: string;

  @IsNumber()
  @ApiModelProperty()
  pair_id: number;

  @Validate(IsCorrectNumber)
  @ApiModelProperty()
  amount: number | string;

  @Validate(IsCorrectNumber)
  @ApiModelProperty()
  fee: number | string;

  @IsNotEmpty()
  @IsOptional()
  @IsString()
  @ApiModelProperty()
  wallet: string;
}