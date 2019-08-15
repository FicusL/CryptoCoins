import { injectable } from 'inversify';
import { action, observable } from 'mobx';
import { AvailableLocale, locales } from '../../../locales';
import { addLocaleData } from 'react-intl';

import en from 'react-intl/locale-data/en';
import ru from 'react-intl/locale-data/ru';

@injectable()
export class LocaleStore {
  @observable locale: AvailableLocale;
  messages = { ... locales };

  constructor() {
    addLocaleData(en);
    addLocaleData(ru);

    const savedLanguage = window.localStorage.getItem('locale') as AvailableLocale;
    if (savedLanguage) {
      this.switchTo(savedLanguage);
      return;
    }

    const defaultAvailableLanguage = 'en';

    const browserLanguage = (navigator.language || (navigator as any).userLanguage).toString()
      .split('-')[0].toLowerCase();

    const availableLanguages = Object.keys(locales);
    if (availableLanguages.indexOf(browserLanguage) !== -1) {
      this.switchTo(browserLanguage);
      return;
    }

    this.switchTo(defaultAvailableLanguage);
  }

  @action
  switchTo(locale: AvailableLocale) {
    window.localStorage.setItem('locale', locale);
    this.locale = locale;
  }
}