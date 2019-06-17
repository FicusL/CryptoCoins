import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class InCounterpartyV1TransactionHistoryDTO {
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  @ApiModelProperty()
  email: string;
}