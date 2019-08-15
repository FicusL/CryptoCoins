import * as React from 'react';
import Input from '../Shared/components/Inputs/Input';
import Modal from '../Modals/components/ModalBase';
import Button from '../Shared/components/Buttons/Button';
import { observer } from 'mobx-react';
import { lazyInject } from '../IoC';
import { FormattedMessage, injectIntl } from 'react-intl';
import { IOnChangeProps } from '../Shared/types/IChangeProps';
import TextArea from '../Shared/components/Inputs/TextArea/TextArea';
import { ContactUsStore } from './store/ContactUsStore';

interface IProps {
  intl: ReactIntl.InjectedIntl;
  onClose: () => void;
}

interface IContactsContainerState {
  email: string;
  firstName: string;
  lastName: string;
  message: string;
}

@observer
class ContactUsModal extends React.Component<IProps, IContactsContainerState> {
  @lazyInject(ContactUsStore)
  readonly store: ContactUsStore;

  constructor(props) {
    super(props);

    this.state = {
      email: '',
      firstName: '',
      lastName: '',
      message: '',
    };
  }

  handleChange = ({name, value}: IOnChangeProps) => {
    this.setState({[name]: value} as any);
    this.store.reset();
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const { email, firstName, lastName, message } = this.state;

    this.store.contactInfoSendAttempt({  email, firstName, lastName, message  })
      .then(() => this.props.onClose());
  };

  render() {
    const { intl } = this.props;

    return (
      <Modal onRequestClose={this.props.onClose} className='modal__contact-us'>
        <h2 className='modal__title'>
          <FormattedMessage id='footer.contactUs.title' defaultMessage='Contact us' />
        </h2>
        <form onSubmit={this.handleSubmit}>
          <div className='col-12 d-flex px-0'>
            <Input
              name='firstName'

              placeholder={intl.formatMessage({
                id: 'footer.contactUs.firstNamePlaceholder',
                defaultMessage: 'First Name',
              })}

              errorMessage={intl.formatMessage({
                id: 'footer.contactUs.incorrectFirstName',
                defaultMessage: 'Incorrect first name',
              })}

              className='pr-3 mb-0'
              onChange={this.handleChange}
              showError={this.store.isFirstNameIncorrect}
            />
            <Input
              name='lastName'

              placeholder={intl.formatMessage({
                id: 'footer.contactUs.lastNamePlaceholder',
                defaultMessage: 'Last Name',
              })}

              errorMessage={intl.formatMessage({
                id: 'footer.contactUs.incorrectLastName',
                defaultMessage: 'Incorrect last name',
              })}

              className='mb-0'
              onChange={this.handleChange}
              showError={this.store.isLastNameIncorrect}
            />
          </div>

          <Input
            name='email'

            placeholder={intl.formatMessage({
              id: 'footer.contactUs.emailPlaceholder',
              defaultMessage: 'Enter your email',
            })}

            errorMessage={intl.formatMessage({
              id: 'footer.contactUs.incorrectEmail',
              defaultMessage: 'Incorrect email',
            })}

            onChange={this.handleChange}
            showError={this.store.isEmailIncorrect}
          />

          <TextArea
            name='message'

            placeholder={intl.formatMessage({
              id: 'footer.contactUs.messagePlaceholder',
              defaultMessage: 'Message',
            })}

            errorMessage={intl.formatMessage({
              id: 'footer.contactUs.incorrectMessage',
              defaultMessage: 'Incorrect message',
            })}

            onChange={this.handleChange}
            showError={this.store.isMessageIncorrect}
          />

          <Button className='dashboard-btn dashboard-btn--modal' type='submit'>
            <FormattedMessage id='footer.contactUs.sendMessage' defaultMessage='Send message' />
          </Button>
        </form>
      </Modal>
    );
  }

}

export default injectIntl(ContactUsModal);