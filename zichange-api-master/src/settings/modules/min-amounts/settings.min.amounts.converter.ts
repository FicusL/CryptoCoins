import { SettingsMinAmountsObject } from './types/settings.min-amounts-object.type';
import { SettingsMinAmountsMap } from './types/settings.min-amounts-map.type';
import { BigNumber } from 'bignumber.js';

export class SettingsMinAmountsConverter {
  static convertFromObject(raw: SettingsMinAmountsObject): SettingsMinAmountsMap {
    const result = new Map();
    Object.keys(raw).forEach((currency) => result.set(currency, new BigNumber(raw[currency])));
    return result;
  }

  static convertToObject(values: SettingsMinAmountsMap): SettingsMinAmountsObject {
    const result = {};
    Array.from(values.entries()).forEach((item) => result[item[0]] = item[1].toString());
    return result;
  }
}