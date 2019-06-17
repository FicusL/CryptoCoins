import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class InCounterpartyLetterTextFooterDTO {
  @IsString()
  @ApiModelProperty()
  letterTextFooter: string;
}