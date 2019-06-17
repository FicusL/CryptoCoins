import { action, computed, observable } from 'mobx';
import Validator from 'validatorjs';
import { IFormStore } from '../../types/IFormStore';
import { injectable } from 'inversify';
import { IField } from '../../types/IField';

export interface IFields {
  [fieldName: string]: IField<any>;
}

@injectable()
export abstract class BaseFormStoreValidatorJS<Fields extends IFields> implements IFormStore<Fields> {
  @observable private readonly _fields: Fields;

  protected abstract getInitialFields(): Fields;

  private _errorMessages = {
    required: 'Field is required',
    required_if: 'Field is required',
    alpha: 'Field must contain only alphabetic characters',
    alpha_dash: 'Field may have alpha-numeric characters, as well as dashes and underscores',
  };

  protected constructor() {
    this._fields = this.getInitialFields();
  }

  @computed
  get fields(): Fields {
    return this._fields;
  }

  @computed
  get isFormValid(): boolean {
    for (const key of Object.keys(this.fields)) {
      const error = this.fields[key].error;
      if (error && error !== '') {
        return false;
      }
    }

    return true;
  }

  @action
  changeField(field: keyof Fields, value: any) {
    this._fields[field].value = value;

    const validation = new Validator(
      { [field]: value },
      { [field]: this.fields[field].rule },
      this._errorMessages,
    );

    this._fields[field].error = validation.errors.first(field as string) as string;
  }

  @action
  updateFields(values: { [field in keyof Fields]: any }) {
    for (const key of Object.keys(values)) {
      this.fields[key].value = values[key];
    }
  }

  @action
  resetFields() {
    for (const key of Object.keys(this.fields)) {
      this.fields[key].value = this.fields[key].defaultValue;
      this.fields[key].error = '';
    }
  }

  @action
  applyErrors(fields: Fields) {
    for (const key of Object.keys(fields)) {
      this.fields[key].error = fields[key].error;
    }
  }

  @action
  validateForm() {
    const data = {};
    const rules = {};

    for (const key of Object.keys(this.fields)) {
      data[key] = this._fields[key].value;
      rules[key] = this._fields[key].rule;
    }

    const validation = new Validator(data, rules, this._errorMessages);
    const isValid = validation.passes() as boolean;

    if (!isValid) {
      for (const field in this.fields) {
        this._fields[field].error = validation.errors.first(field) as string;
      }
    }
  }
}