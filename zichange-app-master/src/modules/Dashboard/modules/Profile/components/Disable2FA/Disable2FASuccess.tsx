import * as React from 'react';
import ModalSuccess from '../../../../../Shared/components/Modal/Success';
import { injectIntl, InjectedIntlProps } from 'react-intl';

interface IProps {
  isOpen: boolean;
  onCloseRequest: () => void;
}

class Disable2FASuccess extends React.Component<IProps & InjectedIntlProps> {
  render() {
    const { intl, isOpen, onCloseRequest } = this.props;
    return (
      <ModalSuccess
        isOpen={isOpen}
        title={intl.formatMessage({
          id: 'dashboard.settings.2fa.disable.success.title',
        })}
        onClose={onCloseRequest}
      />
    );
  }
}

export default injectIntl(Disable2FASuccess);