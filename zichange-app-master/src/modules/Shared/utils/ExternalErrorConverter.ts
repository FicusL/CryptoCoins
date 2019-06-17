import { IFields } from '../stores/Forms/BaseFormStoreValidatorJS';
import { AxiosResponse } from 'axios';
import { HttpStatusCodes } from '../const/HttpStatusCodes';
import { IField } from '../types/IField';

// TODO: Add internationalization support
export class ExternalErrorConverter<Fields extends IFields> {
  constructor(
    private readonly generalProperty: keyof Fields,
    private readonly overrides: { [property: string]: string } = {},
  ) { }

  convert(fields: Fields, error: AxiosResponse): Fields {
    const result = { } as Fields;

    if (!error) {
      return result;
    }

    const isBadRequestError = error.status === HttpStatusCodes.BadRequest;
    if (isBadRequestError) {
      for (const item of error.data.message) {
        let constraint = item.constraints[Object.keys(item.constraints)[0]];
        constraint = constraint.charAt(0).toUpperCase() + constraint.slice(1);

        let property = item.property;
        if (this.overrides[property]) {
          property = this.overrides[property];
        }

        if (!fields.hasOwnProperty(property)) {
          property = this.generalProperty;
        }

        if (!result[property]) {
          result[property] = {} as IField<any>;
        }

        result[property].error = constraint;
      }

      return result;
    }

    for (const item of error.data.message) {
      let property = item.property;
      if (this.overrides[property]) {
        property = this.overrides[property];
      }

      if (!fields.hasOwnProperty(property)) {
        property = this.generalProperty;
      }

      if (!result[property]) {
        result[property] = {} as IField<any>;
      }

      result[property].error = error.data.message;
    }

    return result;
  }
}