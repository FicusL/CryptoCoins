import en from './en.json';
import ru from './ru.json';

export const locales = {
  'en': { ...en },
  'ru': { ...ru },
};

export type AvailableLocale = keyof typeof locales;