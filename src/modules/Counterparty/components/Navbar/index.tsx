import * as React from 'react';
import { lazyInject } from '../../../IoC';
import LocaleSwitcher from '../../../Shared/components/LocaleSwitcher';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { FormattedMessage } from 'react-intl';
import { ColorStore } from '../../../Admin/modules/Counterparty/stores/Colors/ColorStore';
import { IFieldsStyle } from '../../../Admin/modules/Counterparty/dto/IOutStylesDTO';
import { RGBA } from '../../../Shared/types/IRGBA';
import { CounterpartyAccountStore } from '../../stores/CounterpartyAccountStore';
import './style.scss';
import Button from '../../../Shared/components/Buttons/Button';
import { SettingsStore } from '../../../Admin/modules/Counterparty/stores/SettingsStore';
import { UploadStore } from '../../../Admin/modules/Counterparty/stores/UploadStore';

interface IProps {
  colors: IFieldsStyle;
}

@observer
export class CounterpartyNavbar extends React.Component<IProps> {

  @lazyInject(CounterpartyAccountStore)
  counterpartyAccountStore: CounterpartyAccountStore;

  @lazyInject(SettingsStore)
  settingsStore: SettingsStore;

  @lazyInject(ColorStore)
  colorStore: ColorStore;

  @lazyInject(UploadStore)
  uploadStore: UploadStore;

  @observable isMenuActive: boolean = false;

  componentWillMount(): void {
    this.settingsStore.getUrl();
    this.uploadStore.getLogo();
  }

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

  onLogout = () => {
    window.open(this.settingsStore.counterpartyUrl, '_self');
  };

  @action
  showMenu = () => {
    this.isMenuActive = true;
  };

  @action
  hideMenu = () => {
    this.isMenuActive = false;
  };

  render() {
    const {colors} = this.props;

    // debugger;

    return(
      <header className='nav-bar nav-bar--fixed'
              style={{backgroundColor: RGBA.toRGBAString(this.props.colors.backgroundColor),
                      boxShadow: `0 6px 10px 0 ${RGBA.toRGBAString(this.props.colors.boxShadow)}`}}>
        <div className='container nav-bar__container'>
          <div className='row align-items-center justify-content-between no-gutters px-0'>
            <div className='col-3 col-xl-1'>
              <div className='preview__logo d-flex justify-content-center'>
                <a rel='noopener noreferrer' className='d-flex align-items-center'>
                  {this.uploadStore.logoIsLoaded
                    ? <img src={`/api/counterparties/${this.counterpartyAccountStore.accountId}/logo`} alt='logo' />
                    : null
                  }
                </a>
              </div>
            </div>

            <div className='nav-bar__powered-by col col-xl-2'>
              <span className='nav-bar__powered-by__sub-title'
                    style={{color: RGBA.toRGBAString(colors.color)}}>
                Powered by
              </span>
              <div className='nav-bar__powered-by__title'>
                <a href='http://zichain.io/' target='_blank' rel='noopener noreferrer'
                   style={{color: RGBA.toRGBAString(colors.color)}}>
                  Zichain
                </a>
              </div>
            </div>

            <div className='col-xl-8 nav-bar__main col-7'>
              <div className='nav-bar__locale-switcher'>
                <LocaleSwitcher />
              </div>

              <div className='nav-bar__action-btn row'>
                <Button style={{height: '40px'}}
                        onClick={this.onLogout}
                        colors={this.colorStore.styles.button}>
                  <FormattedMessage id='counterparties.returnToWebsite' defaultMessage='Return to website' />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }
}