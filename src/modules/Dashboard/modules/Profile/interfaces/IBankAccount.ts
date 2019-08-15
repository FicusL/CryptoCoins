
export interface IBankAccount {
  id?: number;
  label: string;
  bankName: string;
  recipientName: string;
  currency: string;
  IBAN: string;
  BIC: string;
}