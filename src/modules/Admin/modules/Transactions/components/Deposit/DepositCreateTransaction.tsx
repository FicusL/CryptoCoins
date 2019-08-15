import { ChangeEvent } from 'react';
import * as React from 'react';
import { TransactionsStore } from '../../stores/TransactionsStore';
import { lazyInject } from '../../../../../IoC';
import { Button, Input } from 'antd';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { AxiosWrapper } from '../../../../../Shared/services/AxiosWrapper';
import { LoaderStore } from '../../../../../Shared/modules/Loader/store/LoaderStore';
import SelectSearch from '../../../../../Shared/components/Inputs/SelectSearch';
import { IOnChangeProps } from '../../../../../Shared/types/IChangeProps';

@observer
class DepositCreateTransaction extends React.Component {
  private readonly CREATE_TRANSACTION_TASK = 'CREATE_TRANSACTION_TASK';

  @lazyInject(TransactionsStore)
  store: TransactionsStore;

  @lazyInject(LoaderStore)
  loaderStore: LoaderStore;

  @lazyInject(AxiosWrapper)
  api: AxiosWrapper;

  @observable cryptoAddress: string = '';
  @observable currency: string = '';
  @observable amount: string = '';

  readonly Currencies = [
    { value: 'BTC', label: 'BTC' },
    { value: 'ETH', label: 'ETH' },
    // { value: 'LTC', label: 'LTC' },
    { value: 'ZCN', label: 'ZCN' },
  ];

  async getAccountId(): Promise<number> {
    const url = `/admin/account/wallets/${this.cryptoAddress}/currencies/${this.currency}`;
    const result = await this.api.get(url);
    return result.id;
  }

  async createTransaction(accountId: number) {
    const url = `/transactions/accounts/${accountId}/create_transaction`;
    return await this.api.post(url, {
      type: 'Deposit',
      deposit: {
        isActive: true,
        type: 'crypto_wallet',
        currency: this.currency,
        amount: this.amount,
      },
    });
  }

  handleAdd = async () => {
    this.loaderStore.addTask(this.CREATE_TRANSACTION_TASK);

    try {
      const accountId = await this.getAccountId();
      await this.createTransaction(accountId);

      this.cryptoAddress = '';
      this.amount = '';
    } catch (e) {
      console.log(e);
      alert(JSON.stringify(e.data.message));
    }

    this.loaderStore.removeTask(this.CREATE_TRANSACTION_TASK);
  };

  onChangeCryptoAddress = (e: ChangeEvent<HTMLInputElement>) => {
    this.cryptoAddress = e.target.value;
  };

  onChangeCurrency = (e: IOnChangeProps) => {
    this.currency = e.value;
  };

  onChangeAmount = (e: ChangeEvent<HTMLInputElement>) => {
    this.amount = e.target.value;
  };

  getCurrency = (name) => this.Currencies.find(item => item.value === name);

  render() {
    return(
      <div>
        <Input placeholder='Crypto address: '
               value={this.cryptoAddress}
               onChange={this.onChangeCryptoAddress}
               className='mt-2 mb-2'
        />
        <SelectSearch
          placeholder='Currency: '
          value={this.getCurrency(this.currency)}
          onChange={this.onChangeCurrency}
          className='mt-2 mb-2'
          options={this.Currencies}
        />
        <Input placeholder='Amount: '
               value={this.amount}
               onChange={this.onChangeAmount}
               className='mt-2 mb-2'
        />
        <Button
          htmlType='button'
          onClick={this.handleAdd}
          type='primary'
          className='mb-3'
        >
          Create transaction
        </Button>
      </div>
    );
  }
}

export default DepositCreateTransaction;