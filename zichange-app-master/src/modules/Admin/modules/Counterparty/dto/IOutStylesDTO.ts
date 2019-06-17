import { IRGBA } from '../../../../Shared/types/IRGBA';

export interface IOutStylesDTO {
  button?: IFieldsStyle;
  body?: IFieldsStyle;
  header?: IFieldsStyle;
  text?: IFieldsStyle;
  input?: IFieldsStyle;
  selectSearch?: ISelectSearchFields;
  radioButton?: IFieldsStyle;
}

export interface IFieldsStyle {
  color?: IRGBA;
  backgroundColor?: IRGBA;
  borderColor?: IRGBA;
  borderSize?: number;
  boxShadow?: IRGBA;

  primary?: IRGBA;
  primary25?: IRGBA;
  primary50?: IRGBA;
}

export interface ISelectSearchFields {
  control?: {
    backgroundColor?: IRGBA;
    color?: IRGBA;
    borderColor?: IRGBA;
    borderSize?: number;
  };
  singleValue?: {
    color?: IRGBA;
  };
  menu?: {
    backgroundColor?: IRGBA;
    color?: IRGBA;
  };
  themes?: {
    primary?: IRGBA;
    primary25?: IRGBA;
    primary50?: IRGBA;
  };
}