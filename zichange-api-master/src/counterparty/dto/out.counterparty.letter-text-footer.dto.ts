import { ApiModelPropertyOptional } from '@nestjs/swagger';

export class OutCounterpartyLetterTextFooterDTO {
  @ApiModelPropertyOptional()
  letterTextFooter?: string;
}