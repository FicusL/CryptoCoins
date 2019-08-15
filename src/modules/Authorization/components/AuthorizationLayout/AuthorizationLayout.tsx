import * as React from 'react';
import { AuthorizationNavbar } from '../AuthorizationNavbar/AuthorizationNavbar';

export class AuthorizationLayout extends React.Component {
  render() {
    return (
      <div>
        <AuthorizationNavbar />
        {this.props.children}
      </div>
    );
  }
}