import * as React from 'react';
import './style.scss';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import MapPhone from './assets/map-image-phone.png';
import EstoniaImage from '../../../Shared/assets/images/estonia-image.png';
import SwissbfLogo from '../../../Shared/assets/images/swissbf_logo.png';
import LandingButton from '../LandingButton/LandingButton';
import Navbar from './Navbar';
import { FormattedMessage } from 'react-intl';
import TextFormat from '../../../Shared/components/TextFormats/TextFormat';

class Header extends React.Component<RouteComponentProps> {
  handleClick = () => {
    this.props.history.replace('/register');
  };

  render() {
    return (
      <section className='header'>
        <Navbar/>

        <div className='container header__map'>
          <h2 className='text--center header__map__title'>
            <FormattedMessage id='landing.header.title' />
          </h2>

          <img src={MapPhone} className='header__map__mobile' />

          <div className='row text--center text-md-left align-items-center' style={{ width: '100%' }}>
            <div className='header__map__start-button mb-3 mb-lg-0 col-md order-lg-1'>
              <LandingButton name='active' onClick={this.handleClick}>
                <TextFormat id='landing.getStarted' />
              </LandingButton>
            </div>

            <div className='col-md-12 col-lg-5 order-lg-0 header__map__logo-container'>
              <a href='https://mtr.mkm.ee/juriidiline_isik/225499?backurl=%2Fjuriidiline_isik' target='_blank'>
                <img src={EstoniaImage} className='header__map__logo-container__estonia-image' />
              </a>

            </div>
          </div>
        </div>

      </section>
    );
  }
}

export default withRouter(Header);
