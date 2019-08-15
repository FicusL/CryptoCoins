import './style.scss';
import * as React from 'react';
import { lazyInject } from '../../../../../IoC';
import { ModalStore } from '../../../../../Modals/store/ModalStore';
import Layout from '../../../../../PolicyPages/Layout';

export default class TwoFaInfo extends React.Component {

  @lazyInject(ModalStore)
  private readonly modalStore: ModalStore;

  handleClick = () => {
    this.modalStore.openModal('CONTACT_US');
  };

  render() {
    return (
      <Layout>
        <div className='row twoFA-info'>
          <h2 className='col-12 header mb-3'>
            To set up two-factor authentication in your ZiChange account:
          </h2>

          <div className='col-12 twoFA-info__to-setup-list mb-4'>
            <ol>
              <li>Click the Profile in the top menu.</li>
              <li>Click Enable button next to Two-Factor Authentication (2FA).</li>
              <li>
                Write down or print your Secret Code (16-digit key) and keep it in a safe place.
                You will need it to login if you lose your device.
              </li>
              <li>
                Install and open the Google Authenticator app on your device
                (<a href='https://itunes.apple.com/ru/app/google-authenticator/id388497605?mt=8'>iOS</a>
                &nbsp;or&nbsp;
                <a href='https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=ru'>
                  Android
                </a>).
              </li>
              <li>Scan the QR code.</li>
              <li>
                Enter your account password and the six-digit code generated on your Google Authenticator App.
                Each code is only valid for 30 seconds.
              </li>
              <li>Click Enable 2FA button.</li>
            </ol>
          </div>

          <h2 className='col-12 header mb-3'>
            To disable two-factor authentication in your ZiChange account:
          </h2>

          <div className='col-12 twoFA-info__to-disable-list mb-4'>
            <ol>
              <li>Click the Profile in the top menu.</li>
              <li>Click Disable button next to Two-Factor Authentication (2FA).</li>
              <li>
                Enter your account password and the six-digit code generated on your Google Authenticator App.
                Each code is only valid for 30 seconds.
              </li>
              <li>Click Disable 2FA button.</li>
            </ol>
          </div>

          <h2 className='col-12 header twoFA-info__contact-zichange'>
            For any other questions such as resetting the two-factor authentication or changing the device,
            please <span onClick={this.handleClick}>contact ZiChange support.</span>
          </h2>
        </div>
      </Layout>
    );
  }
}