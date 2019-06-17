import * as React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import Input from '../../../Shared/components/Inputs/Input';
import Button from '../../../Shared/components/Buttons/Button';
import Modal from '../../../Shared/components/Modal/ModalBase';
import { lazyInject } from '../../../IoC';
import TwoFaStore from './TwoFaStore';
import { observer } from 'mobx-react';

interface IState {
  twoFa: string;
}

interface IProps {
  intl: ReactIntl.InjectedIntl;
}

@observer
class TwoFaContainer extends React.Component<IProps, IState>{
  @lazyInject(TwoFaStore)
  readonly twoFaStore: TwoFaStore;

  constructor(props) {
    super(props);
    this.state = {
      twoFa: '',
    };
  }

  handleChange = ({ name, value }) => {
    this.setState({ [name]: value} as any );
  };

  onSubmitHandler = (e) => {
    e.preventDefault();
    this.twoFaStore.send2FA(this.state.twoFa);
  };


  componentWillUnmount(): void {
    this.twoFaStore.reset();
  }

  public render() {
    const { intl } = this.props;

    return(
          <Modal isOpen={true} hideCloseIcon disableOverlay>
            <Modal.Title>
              <FormattedMessage id='authorization.2fa.enter2fa' />
            </Modal.Title>
            <form onSubmit={this.onSubmitHandler}>
              <Input
                label={intl.formatMessage({ id: 'authorization.2fa.enter2fa' })}
                autoFocus
                autoComplete='off'
                name='twoFa'
                type='text'
                onChange={this.handleChange}
                showError={this.twoFaStore.is2FAIncorrect}
                errorMessage={intl.formatMessage({
                  id: 'authorization.2fa.incorrect',
                  defaultMessage: 'Incorrect 2FA code',
                })}
              />

              <div className='whatIs2fa'>
                <a target='_blank' href={`${window.location.origin}/2fa-info`}>
                  <FormattedMessage id='authorization.2fa.whatIs2fa'/>
                </a>
              </div>

              <Button className='dashboard-btn dashboard-btn--modal' type='submit'>
                {intl.formatMessage({id: 'authorization.2fa.ok'})}
              </Button>

            </form>
          </Modal>
    );
  }
}

export default injectIntl(TwoFaContainer);