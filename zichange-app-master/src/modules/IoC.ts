import 'reflect-metadata';

import { Container } from 'inversify';

import { SessionStore } from './Shared/stores/SessionStore';
import { LocaleStore } from './Shared/stores/LocaleStore';
import { LoaderStore } from './Shared/modules/Loader/store/LoaderStore';
import { AxiosWrapper } from './Shared/services/AxiosWrapper';

import { authSingletons } from './Authorization/AuthIoC';
import { dashboardSingletons } from './Dashboard/DashboardIoC';
import { ModalStore } from './Modals/store/ModalStore';
import { FacadeCurrenciesStore } from './Shared/modules/Currencies/store/FacadeCurrenciesStore';
import { CryptoCurrenciesStore } from './Shared/modules/Currencies/store/concrete/CryptoCurrenciesStore';
import { FiatCurrenciesStore } from './Shared/modules/Currencies/store/concrete/FiatCurrenciesStore';
import { DepositMinAmountsStore } from './Shared/modules/MinAmounts/store/concrete/DepositMinAmountsStore';
import { ExchangeMinAmountsStore } from './Shared/modules/MinAmounts/store/concrete/ExchangeMinAmountsStore';
import { WithdrawalMinAmountsStore } from './Shared/modules/MinAmounts/store/concrete/WithdrawalMinAmountsStore';
import { FacadeMinAmountsStore } from './Shared/modules/MinAmounts/store/FacadeMinAmountsStore';
import { Fees } from './Shared/services/Fees/Fees';
import { ContactUsStore } from './ContactUs/store/ContactUsStore';
import { adminSingletons } from './Admin/modules/AdminIoC';
import { counterpartySingltons } from './Counterparty/CounterpartyIoC';

const container = new Container();

const singletons = [
  AxiosWrapper,
  SessionStore,
  LocaleStore,
  LoaderStore,
  ModalStore,

  CryptoCurrenciesStore,
  FiatCurrenciesStore,
  FacadeCurrenciesStore,

  Fees,

  DepositMinAmountsStore,
  ExchangeMinAmountsStore,
  WithdrawalMinAmountsStore,
  FacadeMinAmountsStore,

  ContactUsStore,

  ...dashboardSingletons,
  ...authSingletons,
  ...adminSingletons,
  ...counterpartySingltons,
];

for (const singleton of singletons) {
  container.bind<any>(singleton).to(singleton).inSingletonScope();
}

// New decorator syntax
const lazyInject = (k: any) => (proto: any, key: string, descriptor?: any) => {
  descriptor.initializer = () => container.get(k);
};

export {
  container,
  lazyInject,
};
