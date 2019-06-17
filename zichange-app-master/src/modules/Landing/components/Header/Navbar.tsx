import * as React from 'react';
import { Link } from 'react-router-dom';
import LocaleSwitcher from '../../../Shared/components/LocaleSwitcher';
import { FormattedMessage } from 'react-intl';
import { lazyInject } from '../../../IoC';
import { LocaleStore } from '../../../Shared/stores/LocaleStore';
import Logo from '../../../Shared/assets/images/zichange_final.png';
import { SessionStore } from '../../../Shared/stores/SessionStore';

class Navbar extends React.Component {
  @lazyInject(LocaleStore)
  readonly localeStore: LocaleStore;

  @lazyInject(SessionStore)
  readonly sessionStore: SessionStore;

  render() {

    const { isLoggedIn } = this.sessionStore;

    return (
      <div className='header__navbar'>
        <div className='container'>
          <div className='row header__navbar__container'>

            <div className='container'>
              <div className='row'>
                <div className='row justify-content-start align-items-center col-4 m-0 p-0'>
                  <div className='header__navbar__powered-by__logo'>
                    {isLoggedIn
                      ?
                      <a href='/dashboard'
                         rel='noopener noreferrer'>
                        <img src={Logo} alt='logo' />
                      </a>
                      :
                      <a href='/'
                         rel='noopener noreferrer'>
                        <img src={Logo} alt='logo' />
                      </a>
                    }
                  </div>

                  <div className='header__navbar__powered-by m-0'>
                    <span className='nav-bar__powered-by__sub-title'>Powered by </span>
                    <div className='nav-bar__powered-by__title'>
                      <a href='http://zichain.io/' target='_blank' rel='noopener noreferrer'>Zichain</a>
                    </div>
                  </div>
                </div>

                <div className='row justify-content-end align-items-center col-8 m-0 p-0'>
                  <div className='header__navbar__referral' style={{ flexBasis: 0 }}>
                    <Link to='/referral'>
                      <FormattedMessage id='landing.header.referral' />
                    </Link>
                  </div>

                  <div className='d-flex justify-content-end align-items-center header__navbar__border-control'>
                    <div className='col-4 header__navbar__locale-switcher'>
                      <LocaleSwitcher />
                    </div>

                    <div className='col-8 header__navbar__login'>
                      <Link to='/login' className='header__navbar__login--default'>
                        <FormattedMessage id='landing.header.loginOrRegister' />
                      </Link>
                      <Link to='/login' className='header__navbar__login--mobile'>
                        <FormattedMessage id='landing.header.login'/>
                      </Link>
                    </div>
                  </div>


                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Navbar;