import {IsString} from 'class-validator';
import {ApiModelProperty} from '@nestjs/swagger';

export class InTransactionFindByReferenceIdDTO {
  @IsString()
  @ApiModelProperty()
  referenceId: string;
}