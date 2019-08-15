import * as React from 'react';
import ModalBase from '../../../../../Modals/components/ModalBase';
import Button from '../../../../../Shared/components/Buttons/Button';
import { FormattedMessage } from 'react-intl';

interface IProps {
  description?: string;
  onClose?: () => void;
}

export default class ModalError extends React.Component<IProps> {
  constructor(props) {
    super(props);
  }

  render() {
    const { onClose, description } = this.props;

    return (
      <ModalBase onRequestClose={onClose}>
        <ModalBase.Title>
          <FormattedMessage id='dashboard.transactions.modalError.title' defaultMessage='Error' />
        </ModalBase.Title>

        <p className='modal-note'>
          {description}
        </p>

        <Button className='dashboard-btn dashboard-btn--modal' onClick={onClose}>
          <FormattedMessage id='dashboard.ok' defaultMessage='OK'/>
        </Button>
      </ModalBase>
    );
  }
}