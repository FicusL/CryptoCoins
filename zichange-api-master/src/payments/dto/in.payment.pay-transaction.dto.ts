import { ApiModelProperty } from '@nestjs/swagger';
import { Equals, IsCreditCard, IsNotEmpty, IsNumberString, Length, Matches, Validate } from 'class-validator';
import { MonthValidator, YearValidator } from '../utils/payment.validators';
import { IncorrectCardExpirationDateException } from '../exceptions/incorrect-card-expiration-date.exception';

export class InPaymentPayTransactionDTO {
  @IsCreditCard()
  @ApiModelProperty()
  cardNumber: string;

  @Length(4)
  @IsNumberString()
  @ApiModelProperty()
  @Validate(YearValidator)
  expirationYear: string;

  @Length(2)
  @IsNumberString()
  @ApiModelProperty()
  @Validate(MonthValidator)
  expirationMonth: string;

  @Length(3)
  @IsNumberString()
  @ApiModelProperty()
  cvc: string;

  @IsNotEmpty()
  @Matches(/^[a-zA-Z ]+$/)
  @ApiModelProperty()
  name: string;

  @Equals(true)
  @ApiModelProperty()
  confirm1: boolean;

  @Equals(true)
  @ApiModelProperty()
  confirm2: boolean;

  static validateExpirationDate(dto: InPaymentPayTransactionDTO) {
    const year = +dto.expirationYear;
    const month = +dto.expirationMonth;

    const currentYear = (new Date()).getUTCFullYear();
    const currentMonth = (new Date()).getUTCMonth() + 1;

    if (year === currentYear && month < currentMonth) {
      throw new IncorrectCardExpirationDateException();
    }
  }
}