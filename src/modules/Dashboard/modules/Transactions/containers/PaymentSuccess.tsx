import * as React from 'react';
import { observer } from 'mobx-react';
import { Redirect } from 'react-router';
import { lazyInject } from '../../../../IoC';
import { ModalStore } from '../../../../Modals/store/ModalStore';

interface IProps {
  referenceId: string;
}

@observer
export default class PaymentSuccess extends React.Component<IProps> {
  @lazyInject(ModalStore)
  modalStore: ModalStore;

  render(): React.ReactNode {
    this.modalStore.openModal('SUCCESS', {description: 'Transaction was successfully paid'});

    return (
      <Redirect to={`/dashboard/transactions/${this.props.referenceId}`}/>
    );
  }
}