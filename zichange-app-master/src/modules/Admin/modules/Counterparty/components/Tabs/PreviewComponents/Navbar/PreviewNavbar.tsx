import * as React from 'react';
import { observer } from 'mobx-react';
import { lazyInject } from '../../../../../../../IoC';
import { ColorStore } from '../../../../stores/Colors/ColorStore';
import LocaleSwitcher from '../../../../../../../Shared/components/LocaleSwitcher';
import { FormattedMessage } from '../../../../../../../../react-intl-helper';
import classNames from 'classnames';
import { RGBA } from '../../../../../../../Shared/types/IRGBA';
import { UploadStore } from '../../../../stores/UploadStore';
import { SessionStore } from '../../../../../../../Shared/stores/SessionStore';
import Logo from '../../../../../../../Shared/assets/images/zichange_final.png';
import './style.scss';
import Button from '../../../../../../../Shared/components/Buttons/Button';

@observer
export class PreviewNavbar extends React.Component {

  @lazyInject(ColorStore)
  color: ColorStore;

  @lazyInject(SessionStore)
  sessionStore: SessionStore;

  @lazyInject(UploadStore)
  uploadStore: UploadStore;

  render() {

    return(
      <div style={{backgroundColor: RGBA.toRGBAString(this.color.styles.header.backgroundColor),
                   boxShadow: `0 6px 10px 0 ${RGBA.toRGBAString(this.color.styles.header.boxShadow)}`,
                   padding: '15px 0',
      }}>
        <div className='container nav-bar__container'>
          <div className='row align-items-center justify-content-between no-gutters px-0'>
            <div className='col-3 col-xl-1'>
              <div className='preview__logo d-flex justify-content-center'>
                <a rel='noopener noreferrer' className='d-flex align-items-center'>
                  {this.uploadStore.file ?
                    <img src={this.uploadStore.file} alt='logo' />
                  :
                    <img src={Logo} alt='logo' />
                  }
                </a>
              </div>
            </div>

            <div className='nav-bar__powered-by col col-xl-2'>
              <span style={{color: RGBA.toRGBAString(this.color.styles.header.color)}}
                    className='nav-bar__powered-by__sub-title'>Powered by </span>
              <div className='nav-bar__powered-by__title'>
                <a style={{color: RGBA.toRGBAString(this.color.styles.header.color)}}
                   target='_blank' rel='noopener noreferrer'>Zichain</a>
              </div>
            </div>

            <div className={classNames('col-xl-8 nav-bar__main col-7')}>
              <div className='nav-bar__locale-switcher'>
                <LocaleSwitcher />
              </div>

              <div className='nav-bar__action-btn row'>
                <Button style={{height: '40px', marginRight: '10px'}}
                        colors={this.color.styles.button}>
                  <FormattedMessage id='counterparties.returnToWebsite' defaultMessage='Return to website' />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}