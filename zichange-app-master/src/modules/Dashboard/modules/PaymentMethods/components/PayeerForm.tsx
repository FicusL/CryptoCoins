import * as React from 'react';
import { observer } from 'mobx-react';
import { PayeerPaymentStore } from '../stores/PayeerPaymentStore';
import { lazyInject } from '../../../../IoC';

@observer
export default class PayeerForm extends React.Component {
  @lazyInject(PayeerPaymentStore)
  store: PayeerPaymentStore;

  render(): React.ReactNode {
    return (
      <form method='post' action='https://payeer.com/merchant/' ref={(node) => this.store.attachForm(node)}>
        <input type='hidden' name='m_shop' value={this.store.m_shop} />
        <input type='hidden' name='m_orderid' value={this.store.m_orderid} />
        <input type='hidden' name='m_amount' value={this.store.m_amount} />
        <input type='hidden' name='m_curr' value={this.store.m_curr} />
        <input type='hidden' name='m_desc' value={this.store.m_desc} />
        <input type='hidden' name='m_sign' value={this.store.m_sign} />
        <input style={{ display: 'none' }} type='submit' name='m_process' value='send' />
      </form>
    );
  }
}