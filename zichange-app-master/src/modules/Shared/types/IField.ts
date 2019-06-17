
export interface IField<V> {
  value: V | undefined;
  defaultValue?: V | undefined;
  error: string;
  rule: any;
}
