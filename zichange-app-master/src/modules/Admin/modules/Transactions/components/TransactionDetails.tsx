import * as React from 'react';
import { TransactionModel } from '../../../../Shared/modules/Transactions/model/TransactionModel';
import moment from 'moment';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { ChangeEvent } from 'react';
import { Button, Input } from 'antd';
import { lazyInject } from '../../../../IoC';
import { TransactionsStore } from '../stores/TransactionsStore';

interface IProps {
  transaction: TransactionModel;
}

@observer
class TransactionDetails extends React.Component<IProps> {

  @lazyInject(TransactionsStore)
  store: TransactionsStore;

  @observable fee : string = '';
  @observable toAmount : string = '';
  @observable fromAmount : string = '';
  @observable isFeeDisabled : boolean = true;
  @observable isToAmountDisabled : boolean = true;
  @observable isFromAmountDisabled : boolean = true;

  feeChangeHandler = (e : ChangeEvent<HTMLInputElement>) => {
    this.fee = e.target.value;
  };

  fromAmountChangeHandler = (e : ChangeEvent<HTMLInputElement>) => {
    this.fromAmount = e.target.value;
  };

  toAmountChangeHandler = (e : ChangeEvent<HTMLInputElement>) => {
    this.toAmount = e.target.value;
  };

  onClickFeeEditButton = () => {
    this.isFeeDisabled = !this.isFeeDisabled;
    if (!this.isFeeDisabled) {
      this.fee = this.store.fee;
    }
    this.store.fee = this.fee;
  };

  onClickFromAmountEditButton = () => {
    this.isFromAmountDisabled = !this.isFromAmountDisabled;
    if (!this.isFromAmountDisabled) {
      this.fromAmount = this.store.fromAmount;
    }
    this.store.fromAmount = this.fromAmount;
  };

  onClickToAmountEditButton = () => {
    this.isToAmountDisabled = !this.isToAmountDisabled;
    if (!this.isToAmountDisabled) {
      this.toAmount = this.store.toAmount;
    }
    this.store.toAmount = this.toAmount;
  };

  render() {
    const { transaction } = this.props;

    console.log('transaction: ', transaction);

    return (
      <React.Fragment>
        <h2>Reference ID: {transaction.referenceId}</h2>
        <p>Creation date: {moment(transaction.date).format('DD.MM.YYYY | HH:mm:ss')}</p>
        {transaction.withdrawal && transaction.withdrawal.currency === 'EUR' ?
          <>
            <p>BIC: {transaction.withdrawal.method.data.BIC}</p>
            <p>IBAN: {transaction.withdrawal.method.data.IBAN}</p>
            <p>Currency: {transaction.withdrawal.method.data.currency}</p>
            <p>Bank Name: {transaction.withdrawal.method.data.bankName}</p>
            <p>Recipient Name: {transaction.withdrawal.method.data.recipientName}</p>
          </>
          :
          <> {transaction.withdrawal && <p>Address: {transaction.type === 'DepositExchangeWithdrawal'
              ? transaction.counterpartyWallet
              : transaction.withdrawal.method.data.address}</p>}
          </>
        }

        <p>Type: {transaction.typeString}</p>
        <p>Status: {transaction.statusString}</p>

        {transaction.exchange ?
          <p>From amount: {this.store.fromAmount} {transaction.fromCurrency}</p>
          :
          <div className='container row align-items-center mb-3'>
            <p className='col-4 m-0 p-0'>From amount ({transaction.currency}): </p>
            <Input
              placeholder={this.store.fromAmount}
              disabled={this.isFromAmountDisabled}
              value={this.fromAmount}
              onChange={this.fromAmountChangeHandler}
              className='col-7 mr-2'
              style={{maxWidth: '140px'}}
            />
            <Button htmlType='button' className='col-1' icon={this.isFromAmountDisabled ? 'edit' : 'check'}
                    onClick={this.onClickFromAmountEditButton} />
          </div>
        }

        <div className='container row align-items-center mb-3'>
          <p className='col-4 m-0 p-0'>Fee ({transaction.currency}): </p>
          <Input
            placeholder={this.store.fee}
            disabled={this.isFeeDisabled}
            value={this.fee}
            onChange={this.feeChangeHandler}
            className='col-7 mr-2'
            style={{maxWidth: '140px'}}
          />
          <Button htmlType='button' className='col-1' icon={this.isFeeDisabled ? 'edit' : 'check'}
                  onClick={this.onClickFeeEditButton} />
        </div>

        {!(transaction.deposit) || transaction.type === 'DepositExchangeWithdrawal' ?
          <div className='container row align-items-center mb-3'>
            <p className='col-4 m-0 p-0'>To amount ({transaction.toCurrency}): </p>
            <Input
              placeholder={this.store.toAmount}
              disabled={this.isToAmountDisabled}
              value={this.toAmount.toString()}
              onChange={this.toAmountChangeHandler}
              className='col-7 mr-2'
              style={{maxWidth: '140px'}}
            />
            <Button htmlType='button' className='col-1' icon={this.isToAmountDisabled ? 'edit' : 'check'}
                    onClick={this.onClickToAmountEditButton} />
          </div> : <></>
        }


        <p>Expected date: {moment(transaction.expectedDate).format('DD.MM.YYYY')}</p>
        {transaction.rejectStatus && <p>Reject status: {transaction.rejectStatus}</p>}
        {transaction.rejectReason && <p>Reject reason: {transaction.rejectReason}</p>}
      </React.Fragment>
    );
  }
}

export default TransactionDetails;
