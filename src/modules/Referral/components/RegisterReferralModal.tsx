import * as React from 'react';
import { Countries } from '../../Shared/const/Countries';
import ModalBase from '../../Modals/components/ModalBase';
import Input from '../../Shared/components/Inputs/Input';
import Select from '../../Shared/components/Inputs/Select';
import Button from '../../Shared/components/Buttons/Button';
import { observer } from 'mobx-react';
import { lazyInject } from '../../IoC';
import { SessionStore } from '../../Shared/stores/SessionStore';
import SelectSearch from '../../Shared/components/Inputs/SelectSearch';


interface IState {
  email?: string;
  password?: string;
  country: string;
  fullName: string;
  phone: string;
}

interface IProps {
  onClose: () => void;
}

@observer
class RegisterReferralModal extends React.Component<IProps, IState> {
  state: IState = { country: '', fullName: '', phone: '' };

  @lazyInject(SessionStore)
  sessionStore: SessionStore;

  handleChange = ({ name, value }) => this.setState({ [name]: value } as any);

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  render() {
    const { isLoggedIn } = this.sessionStore;

    return (
      <ModalBase onRequestClose={this.props.onClose}>
        <ModalBase.Title>Register</ModalBase.Title>
        <form onSubmit={this.handleSubmit}>
          {!isLoggedIn &&
          <Input
              name='email'
              type='email'
              label='Email'
              onChange={this.handleChange}
          />
          }

          {!isLoggedIn &&
          <Input
              name='password'
              type='password'
              label='Password'
              onChange={this.handleChange}
          />
          }

          <SelectSearch
            label='Country'
            name='country'
            options={Countries}
            placeholder='Select country...'
            onChange={this.handleChange}
          />

          <Input
            name='fullName'
            label='Full name'
            onChange={this.handleChange}
          />

          <Input
            label='Mobile Phone'
            name='phone'
            type='phone'
            onChange={this.handleChange}
          />

          <Button name='modal' type='submit'>Register</Button>
        </form>
      </ModalBase>
    );
  }
}

export default RegisterReferralModal;
