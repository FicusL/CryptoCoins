import { observable } from 'mobx';
import { injectable } from 'inversify';


interface IMenuItem {
  key: string;
  name: string;
  icon?: string;
  child?: IMenuItem[];
}

@injectable()
export class MenuItemsStore {
  @observable
  adminMenuItems: IMenuItem[] = [
    {
      key: 'transactions',
      name: 'Transactions',
      icon: 'wallet',
      child: [
        {
          key: 'withdrawal',
          name: 'Withdrawal',
          icon: 'wallet',
          child: [
            {
              key: 'pending',
              name: 'Pending',
            },
            {
              key: 'transfer',
              name: 'Transfer',
            },
            {
              key: 'completed',
              name: 'Completed',
            },
            {
              key: 'rejected',
              name: 'Rejected',
            },
            {
              key: 'all',
              name: 'All',
            },
          ],
        },
        {
          key: 'deposit',
          name: 'Deposit',
          icon: 'wallet',
          child: [
            {
              key: 'pending',
              name: 'Pending',
            },
            {
              key: 'approved',
              name: 'Approved',
            },
            {
              key: 'completed',
              name: 'Completed',
            },
            {
              key: 'rejected',
              name: 'Rejected',
            },
            {
              key: 'all',
              name: 'All',
            },
          ],
        },
        {
          key: 'exchange',
          name: 'Exchange',
          icon: 'wallet',
          child: [
            {
              key: 'pending',
              name: 'Pending',
            },
            {
              key: 'completed',
              name: 'Completed',
            },
            {
              key: 'rejected',
              name: 'Rejected',
            },
            {
              key: 'all',
              name: 'All',
            },
          ],
        },
        {
          key: 'exchange_withdrawal',
          name: 'Exchange + Withdrawal',
          icon: 'wallet',
          child: [
            {
              key: 'pending',
              name: 'Pending',
            },
            {
              key: 'boundary_exchange_approved',
              name: 'Boundary Exchange Approved',
            },
            {
              key: 'transfer',
              name: 'Transfer',
            },
            {
              key: 'completed',
              name: 'Completed',
            },
            {
              key: 'rejected',
              name: 'Rejected',
            },
            {
              key: 'all',
              name: 'All',
            },
          ],
        },
        {
          key: 'deposit_exchange_withdrawal',
          name: 'Deposit + Exchange + Withdrawal',
          icon: 'wallet',
          child: [
            {
              key: 'pending',
              name: 'Pending',
            },
            {
              key: 'approved',
              name: 'Approved',
            },
            {
              key: 'payment_failed',
              name: 'Payment Failed',
            },
            {
              key: 'transfer',
              name: 'Transfer',
            },
            {
              key: 'completed',
              name: 'Completed',
            },
            {
              key: 'rejected',
              name: 'Rejected',
            },
            {
              key: 'all',
              name: 'All',
            },
          ],
        },
        {
          key: 'all',
          name: 'All',
        },
      ],
    },
    {
      key: 'kyc',
      name: 'KYC',
      icon: 'solution',
      child: [
        {
          key: 'pending',
          name: 'Pending',
        },
        {
          key: 'approved',
          name: 'Approved',
        },
        {
          key: 'rejected',
          name: 'Rejected',
        },
        {
          key: 'all',
          name: 'All',
        },
      ],
    },
    {
      key: 'clients',
      name: 'Clients',
      icon: 'team',
    },
  ];

  @observable
  amlMenuItems: IMenuItem[] = [
    {
      key: 'kyc',
      name: 'KYC',
      icon: 'solution',
      child: [
        {
          key: 'pending',
          name: 'Pending',
        },
        {
          key: 'approved',
          name: 'Approved',
        },
        {
          key: 'rejected',
          name: 'Rejected',
        },
        {
          key: 'all',
          name: 'All',
        },
      ],
    },
  ];

  @observable
  counterpartyMenuItems: IMenuItem[] = [
    {
      key: 'dashboard',
      name: 'Dashboard',
      icon: 'laptop',
    },
    {
      key: 'clients',
      name: 'Clients',
      icon: 'team',
    },
    {
      key: 'transactions',
      name: 'Transactions',
      icon: 'wallet',
    },
    {
      key: 'white_list_ip',
      name: 'White List',
      icon: 'database',
    },
    {
      key: 'api_keys',
      name: 'API Keys',
      icon: 'key',
    },
    {
      key: 'settings',
      name: 'Settings',
      icon: 'setting',
    },
  ];
}
