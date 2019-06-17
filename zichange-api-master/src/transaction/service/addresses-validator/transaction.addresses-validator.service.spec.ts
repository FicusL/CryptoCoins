import { TransactionAddressesValidatorService } from './transaction.addresses-validator.service';

describe('Addresses validator service', () => {
  let transactionAddressesValidatorService: TransactionAddressesValidatorService;
  let validateAddress: (address: string, currency: string) => void;

  beforeEach(() => {
    transactionAddressesValidatorService = new TransactionAddressesValidatorService();
    validateAddress = transactionAddressesValidatorService.validateAddress.bind(transactionAddressesValidatorService);
  });

  it('BTC', () => {
    expect(() => validateAddress('', 'BTC')).toThrow();
    expect(() => validateAddress('sdf1gsd6f5g1dfg', 'BTC')).toThrow();
    expect(() => validateAddress('1LK1fif14RajnyspWRTeFQGsL1UuEFUEVj', 'BTC')).toThrow();
    expect(validateAddress('1LK1fif14RajnyspWRTeFQGsL1UuEFUEVJ', 'BTC')).toBe(undefined);
  });

  it('ETH', () => {
    expect(() => validateAddress('', 'ETH')).toThrow();
    expect(() => validateAddress('sdf1gsd6f5g1dfg', 'ETH')).toThrow();
    expect(() => validateAddress('0x5f80002af27992e75040dd5fdb8f348e9f1a7e9o', 'ETH')).toThrow();
    expect(validateAddress('0x5f80002af27992e75040dd5fdb8f348e9f1a7e99', 'ETH')).toBe(undefined);
  });

  it('LTC', () => {
    expect(() => validateAddress('', 'LTC')).toThrow();
    expect(() => validateAddress('sdf1gsd6f5g1dfg', 'LTC')).toThrow();
    expect(() => validateAddress('LdUwYqX4c2EWEDGWZzu8u8HGQF8nhoi7Fn', 'LTC')).toThrow();
    expect(validateAddress('LdUwYqX4c2EWEDGWZzu8u8HGQF8nhoi7FN', 'LTC')).toBe(undefined);
  });

  it('ZCN', () => {
    expect(() => validateAddress('', 'ZCN')).toThrow();
    expect(() => validateAddress('sdf1gsd6f5g1dfg', 'ZCN')).toThrow();
    expect(() => validateAddress('0x276a7fcc99dc792b46afc323e0aaec5aafe9918A', 'ZCN')).toThrow();
    expect(validateAddress('0x276a7fcc99dc792b46afc323e0aaec5aafe9918a', 'ZCN')).toBe(undefined);
  });
});