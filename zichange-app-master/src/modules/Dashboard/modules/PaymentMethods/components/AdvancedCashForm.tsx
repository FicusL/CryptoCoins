import * as React from 'react';
import { observer } from 'mobx-react';
import { lazyInject } from '../../../../IoC';
import { AdvancedCashPaymentStore } from '../stores/AdvancedCashPaymentStore';

@observer
export default class AdvancedCashForm extends React.Component {
  @lazyInject(AdvancedCashPaymentStore)
  store: AdvancedCashPaymentStore;

  render(): React.ReactNode {
    return (
      <form method='post' action='https://wallet.advcash.com/sci/' ref={(node) => this.store.attachForm(node)}>
        <input type='hidden' name='ac_account_email' value={this.store.ac_account_email} />
        <input type='hidden' name='ac_sci_name' value={this.store.ac_sci_name} />
        <input type='hidden' name='ac_amount' value={this.store.ac_amount} />
        <input type='hidden' name='ac_currency' value={this.store.ac_currency} />
        <input type='hidden' name='ac_order_id' value={this.store.ac_order_id} />
        <input type='hidden' name='ac_sign' value={this.store.ac_sign} />
        <input type='hidden' name='ac_ps' value={this.store.ac_ps} />
        <input type='hidden' name='ac_comments' value={this.store.ac_comments} />
      </form>
    );
  }
}