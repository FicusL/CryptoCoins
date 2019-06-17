import React from 'react';
import Modal from '../../../../../Shared/components/Modal/Modal';
import { InjectedIntlProps, injectIntl } from 'react-intl';

interface IProps {
  tierLevel: number;
  tierLevelNext: number;
  tierLevelLimit: number;
  remainingLimit: number;
  onClose: () => void;
}

class WithdrawLimitExceededModal extends React.Component<IProps & InjectedIntlProps> {
  render() {
    const { intl, tierLevel, tierLevelNext, remainingLimit, tierLevelLimit } = this.props;
    return(
      <Modal.Error
        title={intl.formatMessage({
          id: 'dashboard.modal.limitExceeded',
          defaultMessage: 'Your limit exceeded',
        })}
        description={intl.formatMessage({
          id: 'dashboard.modal.depositFiat.informationLimitExceeded',
        }, {
          TierLevel: tierLevel,
          TierLevelLimit: tierLevelLimit,
          RemainingLimit: remainingLimit,
          NextTierLevel: tierLevelNext,
        })}
        onClose={this.props.onClose}
      />
    );
  }
}
export default injectIntl(WithdrawLimitExceededModal);