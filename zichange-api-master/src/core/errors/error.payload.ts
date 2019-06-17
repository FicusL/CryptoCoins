import { EnumType } from 'typescript';

interface IErrorPayloadPart {
  code: number | EnumType;
  locale?: string;
  property?: string;
  description?: string;
  module: string;
  data?: object;
}

export type IExceptionMessage = IErrorPayloadPart[];