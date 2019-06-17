import './style.scss';
import * as React from 'react';
import { observer } from 'mobx-react';
import { FormattedMessage } from 'react-intl';

import AccountDetailsContainer from './AccountDetailsContainer';
import SettingsContainer from './SettingsContainer';

@observer
export default class ProfileContainer extends React.Component {
  render() {
    return (
      <section className='account'>
        <div className='container'>

          <h2 className='dashboard_title text-center text-lg-left'>
            <FormattedMessage id='dashboard.settings.personalDetails' />
          </h2>

          <AccountDetailsContainer />
          <SettingsContainer />
        </div>
      </section>
    );
  }
}