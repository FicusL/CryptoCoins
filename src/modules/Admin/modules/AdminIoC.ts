import { MenuItemsStore } from './Layout/stores/MenuItemsStore';
import { TransactionsStore } from './Transactions/stores/TransactionsStore';
import { KycStore } from './KYC/stores/KycStore';
import { ApiKeysStore } from './Counterparty/stores/ApiKeysStore';
import { ClientsStore } from './Counterparty/stores/ClientsStore';
import { ClientsTransactionsStore } from './Counterparty/stores/ClientsTransactionsStore';
import { ColorStore } from './Counterparty/stores/Colors/ColorStore';
import { UploadStore } from './Counterparty/stores/UploadStore';
import { WhiteListIpStore } from './Counterparty/stores/WhiteListIpStore';
import { FieldsStore } from './Counterparty/stores/Colors/FieldsStore';
import { ElementsStore } from './Counterparty/stores/Colors/ElementsStore';
import { SelectSearchFieldsStore } from './Counterparty/stores/Colors/SelectSearchFieldsStore';
import { SettingsStore } from './Counterparty/stores/SettingsStore';
import { AdminClientsStore } from './Clients/stores/AdminClientsStore';

export const adminSingletons = [
  MenuItemsStore,
  TransactionsStore,
  KycStore,
  ApiKeysStore,
  ClientsStore,
  ClientsTransactionsStore,
  ColorStore,
  UploadStore,
  WhiteListIpStore,
  FieldsStore,
  ElementsStore,
  SelectSearchFieldsStore,
  SettingsStore,
  AdminClientsStore,
];