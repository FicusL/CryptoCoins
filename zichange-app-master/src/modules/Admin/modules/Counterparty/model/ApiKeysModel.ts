import { IOutApiKeysDTO } from '../dto/IOutApiKeysDTO';

export class ApiKeysModel {
  id: number;
  label: string;
  firstSymbolsOfPublicKey: string;

  constructor(dto : IOutApiKeysDTO) {
    this.id = dto.id;
    this.label = dto.label;
    this.firstSymbolsOfPublicKey = dto.firstSymbolsOfPublicKey;
  }
}