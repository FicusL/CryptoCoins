import * as React from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import { AuthorizationLayout } from './components/AuthorizationLayout/AuthorizationLayout';
import LoginContainer from './modules/Login/LoginContainer';
import RegisterContainer from './modules/Register/RegisterContainer';
import VerifyEmailContainer from './modules/VerifyEmail/VerifyEmailContainer';
import ResetPasswordRequestContainer from './modules/ResetPassword/Request/ResetPasswordRequestContainer';
import ResetPasswordChangeContainer from './modules/ResetPassword/Change/ResetPasswordChangeContainer';
import { SessionStore } from '../Shared/stores/SessionStore';
import { lazyInject } from '../IoC';
import ConfirmEmailContainer from './modules/ConfirmEmail/ConfirmEmailContainer';
import { StaticContext } from 'react-router';
import TwoFaContainer from './modules/TwoFa/TwoFaContainer';
import { observer } from 'mobx-react';
import { InviteCodesStore } from './modules/Register/InviteCodesStore';

@observer
class AuthRouting extends React.Component<any, StaticContext> {
  @lazyInject(InviteCodesStore)
  private readonly inviteCodesStore: InviteCodesStore;

  @lazyInject(SessionStore)
  private readonly sessionStore: SessionStore;

  componentDidMount(): void {
    this.inviteCodesStore.fetchInviteCodesStatus();
  }

  render() {
    const { isWaitingActivation, isWaiting2FA } = this.sessionStore;

    return (
      <AuthorizationLayout>
        <Switch>
          <Route path='/verify_email/:token' component={(props) =>
            <VerifyEmailContainer token={props.match.params.token} /> }
          />

          <Route path='/verify_email_waiting' render={ () => isWaitingActivation
            ? (<ConfirmEmailContainer />)
            : (<Redirect to='/login'/>)
          }/>

          <Route exact path='/2fa' render={ () => isWaiting2FA
            ? (<TwoFaContainer />)
            : (<Redirect to='/login'/>)
          }/>

          {isWaitingActivation && <Redirect to='/verify_email_waiting' />}
          {isWaiting2FA && <Redirect to='/2fa' />}

          <Route exact path='/login' component={LoginContainer} />

          <Route path='/register/referral/:referralToken' component={(props) =>
            <RegisterContainer referralToken={props.match.params.referralToken} /> }
          />
          <Route exact path='/register' component={RegisterContainer} />
          <Route path='/register/:invite_code' component={(props) =>
            <RegisterContainer invite_code={props.match.params.invite_code} {...props} /> }
          />

          <Route exact path='/reset_password' component={ResetPasswordRequestContainer} />
          <Route path='/reset_password/:token' component={(props) =>
            <ResetPasswordChangeContainer token={props.match.params.token} /> }
          />

          <Redirect to='/login' />
        </Switch>
      </AuthorizationLayout>
    );
  }
}
export default withRouter(AuthRouting);