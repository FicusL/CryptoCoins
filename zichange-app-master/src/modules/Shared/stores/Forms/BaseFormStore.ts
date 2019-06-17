import { action, computed, extendObservable, observable } from 'mobx';
import { injectable } from 'inversify';
import { getFromContainer, MetadataStorage, ValidationError } from 'class-validator';
import { transformAndValidate } from 'class-transformer-validator';
import { ClassType } from 'class-transformer/ClassTransformer';

export type IValues<T = any> = Partial<T>;
export type IErrors<T> = Partial<Record<keyof T, string>>;
export type IConverters<T> = Partial<Record<keyof T, (value) => any>>;

@injectable()
export abstract class BaseFormStore<V extends IValues> {
  @computed
  get values() {
    return this.internalValues;
  }

  @computed
  get errors() {
    return this.internalErrors;
  }

  @observable protected internalValues: IValues<V>;
  @observable protected internalErrors: IErrors<V>;

  protected readonly converters: IConverters<V>;

  abstract get type(): ClassType<V>;

  protected getPropertyNames() {
    const metadata = getFromContainer(MetadataStorage).getTargetValidationMetadatas(this.type, typeof this.type);
    return metadata.map(value => value.propertyName);
  }

  protected getInitialValues(): IValues<V> {
    return {};
  }

  protected getInitialErrors(): IErrors<V> {
    return {};
  }

  protected getConverters(): IConverters<V> {
    return {};
  }

  // noinspection JSMethodCanBeStatic
  protected getChangeValidationEnabled(): boolean {
    return true;
  }

  // noinspection TypeScriptAbstractClassConstructorCanBeMadeProtected
  constructor() {
    this.converters = this.getConverters();

    const initialValues = this.getInitialValues();
    const initialErrors = this.getInitialErrors();

    for (const propertyName of this.getPropertyNames()) {
      if (!initialValues.hasOwnProperty(propertyName)) {
        initialValues[propertyName] = '';
      }

      if (!initialErrors.hasOwnProperty(propertyName)) {
        initialErrors[propertyName] = undefined;
      }
    }

    this.internalValues = {};
    extendObservable(this.internalValues, initialValues);

    this.internalErrors = {};
    extendObservable(this.internalErrors, initialErrors);

    this.change = this.change.bind(this);
    this.setValue = this.setValue.bind(this);
    this.setError = this.setError.bind(this);
    this.validate = this.validate.bind(this);
  }

  @action
  change<K extends keyof V>(key: K, value: V[K]) {
    this.setValue(key, value);

    const isChangeValidationEnabled = this.getChangeValidationEnabled();
    if (!isChangeValidationEnabled) {
      this.setError(key, undefined);
    }

    const object = { [key]: value };
    const validatorOptions =  { skipMissingProperties: true };

    transformAndValidate(this.type, object, { validator: validatorOptions })
     .then(() => {
        this.setError(key, undefined);
      })
      .catch((errors: ValidationError[]) => {
        const firstError = errors[0];
        if (!firstError) {
          this.setError(key, undefined);
          return;
        }

        const firstConstraintKey = Object.getOwnPropertyNames(firstError.constraints)[0];
        this.setError(key, firstError.constraints[firstConstraintKey]);
      });

    // window.localStorage.setItem(key as string, value);
  }

  @action
  setError<K extends keyof V>(key: K, error: string | undefined) {
    if (!this.errors.hasOwnProperty(key)) {
      this.internalErrors = { ...(this.errors as object), [key]: error } as IErrors<V>;
    } else {
      this.internalErrors[key as any] = error;
    }
  }

  @action
  setValue<K extends keyof V>(key: K, value: V[K]) {
    if (!this.values.hasOwnProperty(key)) {
      this.internalValues = { ...(this.values as object), [key]: value } as IValues<V>;
    } else {
      this.internalValues[key] = value;
    }
  }

  @action
  reset() {
    const initialValues = this.getInitialValues();
    for (const key of Object.keys(this.values)) {
      this.setValue(key, initialValues[key]);
      this.setError(key, undefined);
    }
  }

  @action
  async validate(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      transformAndValidate(this.type, this.values)
        .then(() => resolve(true))
        .catch((errors: ValidationError[] | any) => {
          if (errors.message) {
            reject(errors);
            return;
          }

          if (!errors.length) {
            resolve(true);
            return;
          }

          for (const error of errors) {
            const firstConstraintKey = Object.getOwnPropertyNames(error.constraints)[0];
            this.setError(error.property, error.constraints[firstConstraintKey]);
          }

          resolve(false);
        });
    });
  }
}
