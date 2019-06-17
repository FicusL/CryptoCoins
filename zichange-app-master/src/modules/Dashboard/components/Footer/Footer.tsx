import * as React from 'react';
import './style.scss';
import Socials from './Socials';
import LocationSVG from './icons/location.svg';
import Logo from '../../../Shared/assets/images/zichain.png';
import ExchangeImage from './exchange.png';
import { Link } from 'react-router-dom';
import ReactSVG from 'react-svg';
import { injectIntl, InjectedIntlProps } from 'react-intl';


class Footer extends React.Component<InjectedIntlProps> {

  render() {
    const { intl } = this.props;
    return (
      <footer className='footer'>
        <div className='container'>
          <div className='row' style={{
            justifyContent: 'space-between',
            padding: '15px',
          }}>
            <div>
              <div className='footer__links'>
                {/*<Link to='/faq'>FAQ</Link>*/}
                {/*<Link to='/fees'>Fees</Link>*/}
                <Link to='#'>{intl.formatMessage({
                  id: 'dashboad.footer.aboutUs',
                  defaultMessage: 'About us',
                })}</Link>
                <Link to='#'>{intl.formatMessage({
                  id: 'dashboad.footer.contacts',
                  defaultMessage: 'Contacts',
                })}</Link>
                <a href={'/documents/Terms and Conditions.pdf'} target='_blank'>{intl.formatMessage({
                  id: 'landing.footer.termsAndCondition',
                  defaultMessage: 'Terms & Conditions',
                })}</a>
                <a href={'/documents/Privacy Policy.pdf'} target='_blank'>{intl.formatMessage({
                  id: 'landing.footer.privacyPolicy',
                  defaultMessage: 'Privacy Policy',
                  })}</a>
                <a href={'/documents/KYC-AML Policy.pdf'} target='_blank'>{intl.formatMessage({
                  id: 'landing.footer.AMLPolicy',
                  defaultMessage: 'KYC/AML Policy',
                })}</a>
              </div>

              <Socials />
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              width: '350px',
            }}>
              <img src={ExchangeImage} />
            </div>
          </div>

          <p className='disclaimer'>
            {intl.formatMessage({
              id: 'dashboad.footer.disclaimer',
            })}
          </p>
          
          <p className='footer__logo-container'>
            <img className='footer__logo' src={Logo} alt='logo' />
          </p>

          <div className='footer__address'>
            <ReactSVG src={LocationSVG} svgClassName='location-svg' />
            {intl.formatMessage({
              id: 'dashboard.footer.adress',
              defaultMessage: 'Narva mnt 13, Kesklinna linnaosa 10151, Tallinn, Estonia',
            })}
          </div>

          <p className='footer__copyright'>
           {
             intl.formatMessage({
               id: 'dashboard.footer.corp',
               defaultMessage: '© Zichange. 2019',
             })
           }
          </p>
        </div>
      </footer>
    );
  }
}

export default injectIntl(Footer);