import * as React from 'react';
import { FormattedMessage } from 'react-intl';

interface ILogoutProps {
  onLogout: () => any;
}

class LogoutButton extends React.Component<ILogoutProps>{
    handleClick = (e) => {
      e.preventDefault();
      this.props.onLogout();
    };

    public render() {
      return(
        <button className='logout-btn' onClick={this.handleClick} >
          <FormattedMessage id='dashboard.main.logout' defaultMessage='Logout' />
        </button>
      );
    }
}

export default LogoutButton;