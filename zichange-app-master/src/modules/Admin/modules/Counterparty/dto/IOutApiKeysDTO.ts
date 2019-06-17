export interface IOutApiKeysDTO {
  id: number;
  label: string;
  firstSymbolsOfPublicKey: string;
  publicKey?: string;
  secretKey?: string;
}