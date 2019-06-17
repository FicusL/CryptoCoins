import { IFields } from '../../../../Shared/stores/Forms/BaseFormStoreValidatorJS';
import { IField } from '../../../../Shared/types/IField';

export interface ICryptoWalletFields extends IFields {
  label: IField<string>;
  address: IField<string>;
}