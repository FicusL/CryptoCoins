import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { BigNumber } from 'bignumber.js';

@ValidatorConstraint()
export class IsCorrectNumber implements ValidatorConstraintInterface {
  validate(data: any, validationArguments: ValidationArguments) {
    const number = new BigNumber(data);

    return number.isFinite() && !number.isNaN();
  }

  defaultMessage?(validationArguments?: ValidationArguments): string {
    if (validationArguments) {
      return `${validationArguments.property} must be a number`;
    }

    return `Must be a number`;
  }
}