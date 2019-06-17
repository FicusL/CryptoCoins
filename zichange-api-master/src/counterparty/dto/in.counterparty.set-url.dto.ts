import { IsNotEmpty, IsString } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class InCounterpartySetUrlDTO {
  @IsString()
  @IsNotEmpty()
  @ApiModelProperty()
  url: string;
}