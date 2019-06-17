import {IsNumber} from 'class-validator';

export class InAdminGetKycDto {
  @IsNumber()
  accountId: number;
}