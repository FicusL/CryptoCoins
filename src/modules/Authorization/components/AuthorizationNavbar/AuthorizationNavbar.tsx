import * as React from 'react';
import { Navbar } from '../../../Shared/components/Navbar/Navbar';
import LogoutButton from '../../../Shared/components/Navbar/LogoutButton';
import { lazyInject } from '../../../IoC';
import { SessionStore } from '../../../Shared/stores/SessionStore';

export class AuthorizationNavbar extends React.Component {
  @lazyInject(SessionStore)
  private readonly sessionStore: SessionStore;

  onLogout = () => {
    this.sessionStore.logout();
  };

  render() {
    return (
      <Navbar links={[]} mobileLinks={[]}>
        {this.sessionStore.isLoggedIn && <LogoutButton onLogout={this.onLogout} />}
      </Navbar>
    );
  }

}