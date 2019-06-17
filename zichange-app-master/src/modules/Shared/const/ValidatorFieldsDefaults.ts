import { IField } from '../types/IField';

export const RequiredStringDefault: IField<string> = {
  value: '',
  error: '',
  rule: 'required',
};