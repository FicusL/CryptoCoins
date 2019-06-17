import * as React from 'react';
import { INavbarLinkLocation, NavbarLinks } from './NavbarLinks';
import LocaleSwitcher from '../LocaleSwitcher';
import Logo from '../../assets/images/zichange_final.png';
import classNames from 'classnames';

import './style.scss';
import { lazyInject } from '../../../IoC';
import { observer } from 'mobx-react';
import { SessionStore } from '../../stores/SessionStore';
import { action, observable } from 'mobx';

interface INavbarProps {
  links: INavbarLinkLocation[];
  mobileLinks: INavbarLinkLocation[];
}

interface INavbarState {
  isMenuActive: boolean;
}

@observer
export class Navbar extends React.Component<INavbarProps, INavbarState> {

  @lazyInject(SessionStore)
  readonly sessionStore: SessionStore;

  @observable isMenuActive: boolean = false;

  componentDidMount() {
    window.onscroll = () => {
      const y = window.pageYOffset || document.documentElement.scrollTop;
      const navbar = document.querySelector('.nav-bar');
      if (!navbar) {
        return;
      }

      if (y >= 0) {
        navbar.classList.add('nav-bar--fixed');
      } else {
        navbar.classList.remove('nav-bar--fixed');
      }
    };
  }

  @action
  showMenu = () => {
      this.isMenuActive = true;
  };

  @action
  hideMenu = () => {
      this.isMenuActive = false;
  };

  render() {

    const {isLoggedIn} = this.sessionStore;

    return(
      <header className='nav-bar nav-bar--fixed'>
        <div className='container nav-bar__container'>
          <div className='row align-items-center justify-content-between no-gutters px-0'>
            <div className='col-3 col-xl-1'>
              <div className='nav-bar__powered-by__logo'>
                {isLoggedIn ?
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
            </div>

            <div className='nav-bar__powered-by col col-xl-2'>
              <span className='nav-bar__powered-by__sub-title'>Powered by </span>
              <div className='nav-bar__powered-by__title'>
                <a href='http://zichain.io/' target='_blank' rel='noopener noreferrer'>Zichain</a>
              </div>
            </div>

            <div className={classNames('col-xl-8 nav-bar__main', isLoggedIn ? 'col-7' : 'col-9')}>
              <div className='nav-bar__xl-nav'>
                <NavbarLinks links={this.props.links} onLinkClick={() => null}/>
              </div>

              <div className='nav-bar__locale-switcher'>
                <LocaleSwitcher />
              </div>

              <div className='nav-bar__xl-nav'>
                <div className='nav-bar__action-btn row'>
                  {this.props.children}
                </div>
              </div>
            </div>

            <div className='col-2 nav-bar__menu-btn-container'>
              {isLoggedIn &&
                <div className='nav-bar__menu-btn' onClick={this.isMenuActive ? this.hideMenu : this.showMenu}>
                  <span className={this.isMenuActive
                    ? 'nav-bar__menu-row nav-bar__menu-row--active'
                    : 'nav-bar__menu-row'}/>
                  <span className={this.isMenuActive
                    ? 'nav-bar__menu-row nav-bar__menu-row--active'
                    : 'nav-bar__menu-row'}/>
                  <span className={this.isMenuActive
                    ? 'nav-bar__menu-row nav-bar__menu-row--active'
                    : 'nav-bar__menu-row'}/>
                </div>
              }

            </div>
          </div>
        </div>

        <div className={this.isMenuActive ? 'mob-menu active' : 'mob-menu'}>
          <div>
            <NavbarLinks links={this.props.mobileLinks} onLinkClick={this.hideMenu}/>

            <br />

            <div className='nav-bar__action-btn row'>
              {this.props.children}
            </div>
          </div>
        </div>
      </header>
    );
  }
}
