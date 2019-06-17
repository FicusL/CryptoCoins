import { ApiModelProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class InAddIndexDTO {
  @ApiModelProperty()
  @IsString()
  title: string;

  @ApiModelProperty()
  @Matches(/^\d+\.?\d*$/)
  supply: string;
}