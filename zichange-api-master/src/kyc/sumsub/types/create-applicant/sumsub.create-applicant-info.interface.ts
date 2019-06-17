import { ISumsubCreateApplicantCryptoWallet } from './sumsub.create-applicant-crypto-wallet.interface';
import { ISumsubCreateApplicantAddress } from './sumsub.create-applicant-address.interface';

export interface ISumsubCreateApplicantInfo {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  legalName?: string;
  gender?: string;
  dob?: string; // NOTE: format YYYY-mm-dd
  placeOfBirth?: string;
  countryOfBirth?: string;
  stateOfBirth?: string;
  country?: string; // Alpha-3 country code (e.g. DEU or RUS). https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3
  nationality?: string; // Alpha-3 country code. https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3
  phone?: string;
  mobilePhone?: string;
  addresses?: ISumsubCreateApplicantAddress[];
  cryptoWallets?: ISumsubCreateApplicantCryptoWallet[];
}