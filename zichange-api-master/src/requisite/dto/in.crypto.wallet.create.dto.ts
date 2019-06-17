import {IsNotEmpty, IsNumber, IsOptional, MaxLength, MinLength} from 'class-validator';
import {ApiModelProperty, ApiModelPropertyOptional} from '@nestjs/swagger';
import {CryptoWalletEntity} from '../entity/crypto.wallet.entity';
import {InCryptoWalletUpdateDTO} from './in.crypto.wallet.update.dto';

export class InCryptoWalletCreateDTO extends InCryptoWalletUpdateDTO {
  @IsNumber()
  @ApiModelProperty()
  accountId: number;
}