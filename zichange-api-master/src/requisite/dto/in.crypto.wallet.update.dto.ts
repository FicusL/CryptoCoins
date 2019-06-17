import {IsNotEmpty, IsOptional, MaxLength, MinLength} from 'class-validator';
import {ApiModelProperty, ApiModelPropertyOptional} from '@nestjs/swagger';

export class InCryptoWalletUpdateDTO {
  @IsOptional()
  @MaxLength(64)
  @ApiModelPropertyOptional()
  label: string;

  @IsNotEmpty()
  @MinLength(26)
  @MaxLength(34)
  @ApiModelProperty()
  address: string;
}