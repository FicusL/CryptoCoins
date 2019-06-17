import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUppercase, Matches, MaxLength, MinLength } from 'class-validator';

export class InBankAccountUpdateDTO {
  @IsOptional()
  @MaxLength(64)
  @ApiModelPropertyOptional()
  label: string | undefined;

  @MinLength(3)
  @MaxLength(128)
  @ApiModelProperty()
  bankName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(512)
  @ApiModelProperty()
  IBAN: string;

  @MinLength(1)
  @MaxLength(4)
  @ApiModelProperty()
  currency: string;

  @MinLength(8)
  @MaxLength(11)
  @IsUppercase()
  @Matches(/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{0,3})?$/, { message: 'Incorrect SWIFT/BIC format' })
  @ApiModelProperty()
  BIC: string;

  @MaxLength(512)
  @IsString()
  @ApiModelProperty()
  recipientName: string;
}