import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint()
export class YearValidator implements ValidatorConstraintInterface {
  validate(text: string, validationArguments: ValidationArguments) {
    const year = +text;
    return year >= (new Date()).getFullYear();
  }
}

@ValidatorConstraint()
export class MonthValidator implements ValidatorConstraintInterface {
  validate(text: string, validationArguments: ValidationArguments) {
    const month = +text;
    return month >= 1 && month <= 12;
  }
}
