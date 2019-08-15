import { IField } from '../../../../Shared/types/IField';
import { IFields } from '../../../../Shared/stores/Forms/BaseFormStoreValidatorJS';

export interface IBankAccountFields extends IFields {
  label: IField<string>;
  bankName: IField<string>;
  recipientName: IField<string>;
  currency: IField<string>;
  IBAN: IField<string>;
  BIC: IField<string>;
}