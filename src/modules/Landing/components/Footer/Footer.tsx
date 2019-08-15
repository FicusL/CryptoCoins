import * as React from 'react';
import './style.scss';
import EstoniaImage from '../../../Shared/assets/images/estonia-image.png';
import MasterCardImage from './assets/mc_symbol.svg';
import VisaImage from './assets/visa_pos_fc_rgb.svg';
import { FormattedMessage } from 'react-intl';
import { lazyInject } from '../../../IoC';
import { ModalStore } from '../../../Modals/store/ModalStore';


class Footer extends React.Component {

  @lazyInject(ModalStore)
  readonly modalStore: ModalStore;

  handleClick = () => {
    this.modalStore.openModal('CONTACT_US');
  };

  render() {
    return (
      <section className='footer'>
        <div className='footer__first-section'>
          <div className='container'>
            <div className='footer__container row'>
              <div className='footer__documents col-12 col-md-4 align-items-center align-items-md-start'>
                <a href='/fees-deposits' target='_blank'>
                  <FormattedMessage id='landing.footer.feesDepositsAndWithdrawals' />
                </a>
                <a href={'/documents/Terms and Conditions.pdf'} target='_blank'>
                  <FormattedMessage id='landing.footer.termsAndCondition' />
                </a>
                <a href={'/documents/Privacy Policy.pdf'} target='_blank'>
                  <FormattedMessage id='landing.footer.privacyPolicy' />
                </a>
                <a href='/kyc-aml-policy' target='_blank'>
                  <FormattedMessage id='landing.footer.AMLPolicy' />
                </a>
              </div>

              <div className='footer__info-links col-12 col-md-4 mb-4 mb-md-0'>
                <a href='/anti-fraud-policy' target='_blank'>
                  <FormattedMessage id='landing.footer.antiFraudPolicy' />
                </a>
                <a href='/refund-policy' target='_blank'>
                  <FormattedMessage id='landing.footer.refundPolicy' />
                </a>
                <a href='/payments-security' target='_blank'>
                  <FormattedMessage id='landing.footer.onlinePaymentsSecurity' />
                </a>
                <p className='footer__info-links__contact-us mb-0' onClick={this.handleClick}>
                  <FormattedMessage id='landing.footer.contactUs' />
                </p>
                <div className='footer__referral'>
                  <a href='/dashboard/referral_program' target='_blank'>
                    <FormattedMessage id='referralProgram.title' />
                  </a>
                </div>
              </div>

              <div className='footer__estonia-image col-12 col-md-4 align-items-center align-items-md-end'>
                <p className='footer__estonia-image__title'>
                  <span>Regulated</span> <br />Crypto Exchange
                </p>
                <a href='https://mtr.mkm.ee/juriidiline_isik/225499?backurl=%2Fjuriidiline_isik' target='_blank'>
                  <img src={EstoniaImage} />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className='footer__second-section'>
          <div className='container'>
            <div className='footer__container row'>
              <div className='footer__address col-12 col-md-4 text-center text-md-left mb-3 mb-md-0'>
                BaGuk Finance OÜ trading as ZiChange<br />
                Narva mnt 13, 10151, Tallinn, Estonia<br />
                Registry code: 14432499<br />
                Tel.: +372 713 08 87<br />
              </div>

              <div className='footer__cards col-12 col-md-4 text-center mb-3 mb-md-0'>
                <img src={MasterCardImage} className='pr-3' />
                <img src={VisaImage} />
              </div>

              <div className='footer__copyright col-12 col-md-4 text-center text-md-right'>
                © 2019 <span className='pl-1'>zichange.io</span> <br/>
                <a href='mailto:support@zichange.io'><span>support@zichange.io</span></a><br/>
                <FormattedMessage id='landing.footer.allRightsReserved' />
              </div>
            </div>
            <div className='footer__container row'>
              <span className='footer__risk-warning'>
                <FormattedMessage id='landing.footer.disclaimer'/>
              </span>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default Footer;
