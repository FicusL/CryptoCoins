import * as React from 'react';
import { observer } from 'mobx-react';
import { Redirect } from 'react-router';
import { lazyInject } from '../../../../IoC';
import { ModalStore } from '../../../../Modals/store/ModalStore';

interface IProps {
  referenceId: string;
}

@observer
export default class PaymentFail extends React.Component<IProps> {
  @lazyInject(ModalStore)
  modalStore: ModalStore;

  render(): React.ReactNode {
    this.modalStore.openModal('ERROR',
      {description: 'An error occurred during payment. Please try again or contact the support.'});

    return (
      <Redirect to={`/dashboard/transactions/${this.props.referenceId}`}/>
    );
  }
}