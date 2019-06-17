import * as React from 'react';
import { lazyInject } from '../../../../IoC';
import { RoyalPayPaymentStore } from '../stores/RoyalPayPaymentStore';

class RoyalPayForm extends React.Component {

  @lazyInject(RoyalPayPaymentStore)
  store: RoyalPayPaymentStore;

  render(): React.ReactNode {

    const inputs = this.store.params &&
      this.store.params.map(item => <input type='hidden' key={item[0]} name={item[0]} value={item[1] as string} />);

    return (
      <form method={this.store.method} action={this.store.url} target='_self' ref={(node) => this.store.attachForm(node)}>
        {inputs}
      </form>

    );
  }
}

export default RoyalPayForm;