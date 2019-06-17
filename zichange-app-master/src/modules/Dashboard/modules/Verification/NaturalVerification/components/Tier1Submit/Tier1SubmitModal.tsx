import * as React from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { observer } from 'mobx-react';
import Modal from '../../../../../../Shared/components/Modal/Modal';

interface IProps {
  onClose?: () => void;
}

@observer
class Tier1SubmitModal extends React.Component<IProps & InjectedIntlProps> {

  public render() {
    const { onClose, intl } = this.props;

    return (
      <Modal.Success
        title={intl.formatMessage({
          id: 'dashboard.kyc.tier1.submitModalTitle',
          defaultMessage: 'Application for Tier 1 verification has been succesfully sent for review',
        })}
        description={intl.formatMessage({
          id: 'dashboard.kyc.tier1.submitModalDescription',
          defaultMessage: 'The review process can take up to 3 days. You will be notified via email' +
          ' when the status of your verification changes. We may request additional documents, ' +
          'which are necessary to verify the information provided.',
        })}
        onClose={onClose}
      />
    );
  }
}
export default injectIntl(Tier1SubmitModal);