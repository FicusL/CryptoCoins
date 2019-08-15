import { IFields } from '../../../../Shared/stores/Forms/BaseFormStoreValidatorJS';
import { IField } from '../../../../Shared/types/IField';

export interface IPaymentFields extends IFields {
  cardNumber: IField<string>;
  owner: IField<string>;
  cvc: IField<string>;
}