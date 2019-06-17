

export interface IFormStore<FormFields = any> {
  fields: FormFields;
  isFormValid: boolean;
  changeField: (field: keyof FormFields, value: any) => void;
  validateForm: () => void;
}