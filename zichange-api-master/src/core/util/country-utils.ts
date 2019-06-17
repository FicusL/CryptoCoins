import { Countries } from '../../kyc/const/countries';

export function innerCountryToSumSub(country: string): string {
  const founded = Countries.find(item => item.value === country);
  return founded ? founded.iso : country;
}