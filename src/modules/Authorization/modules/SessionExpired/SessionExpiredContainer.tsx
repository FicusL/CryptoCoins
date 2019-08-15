import * as React from 'react';
import Modal from '../../../Shared/components/Modal/ModalBase';
import { lazyInject } from '../../../IoC';
import { ModalStore } from '../../../Modals/store/ModalStore';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import Button from '../../../Shared/components/Buttons/Button';
import { FormattedMessage } from '../../../../react-intl-helper';
import { observer } from 'mobx-react';

@observer
class SessionExpiredContainer extends React.Component<InjectedIntlProps> {

  @lazyInject(ModalStore)
  modalStore: ModalStore;

  handleSubmit = () => {
    this.modalStore.closeModal('SESSION_EXPIRED');
  };

  render() {

    const { intl } = this.props;

    return (
      <Modal style={{overlay: {
        zIndex: '1000',
      }}} isOpen disableOverlay className='modal__login'>
        <h2 className='modal__title'>
          <FormattedMessage id='authorization.signIn' defaultMessage='Login' />
        </h2>
        <form onSubmit={this.handleSubmit}>
          <div className='container row m-0 d-flex justify-content-center'>
            <p className='p-0 col-12 mb-3'>
              {intl.formatMessage({
                id: 'session.expired',
                defaultMessage: 'Your session has expired. Please log in again.',
              })}
            </p>
            <Button className='col-12 dashboard-btn dashboard-btn--modal' type='submit'>
              {intl.formatMessage({
                id: 'authorization.2fa.ok',
                defaultMessage: 'OK',
              })}
            </Button>
          </div>
        </form>
      </Modal>
    );
  }
}

export default injectIntl(SessionExpiredContainer);
