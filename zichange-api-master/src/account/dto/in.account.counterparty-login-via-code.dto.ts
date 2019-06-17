import { IsString, Length } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class InAccountCounterpartyLoginViaCodeDTO {
  @IsString()
  @Length(6)
  @ApiModelProperty()
  code: string;
}