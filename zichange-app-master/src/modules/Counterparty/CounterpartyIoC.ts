import { TransactionProgressStore } from './components/TransactionProgess/stores/TransactionProgressStore';
import { PaymentStore } from './modules/PaymentMethod/stores/PaymentStore';
import { CounterpartyAccountStore } from './stores/CounterpartyAccountStore';
import { ActiveAccountStore } from './modules/Authorization/stores/ActiveAccountStore';
import { VerificationStore } from './modules/Verification/stores/VerificationStore';

export const counterpartySingltons = [
  TransactionProgressStore,
  PaymentStore,
  CounterpartyAccountStore,
  ActiveAccountStore,
  VerificationStore,
];
