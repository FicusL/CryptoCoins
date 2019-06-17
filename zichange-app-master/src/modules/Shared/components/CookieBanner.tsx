import * as React from 'react';
import CookieBannerComponent from 'react-cookie-banner';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { RouteComponentProps } from 'react-router';
import { lazyInject } from '../../IoC';
import { observer } from 'mobx-react';
import { LocaleStore } from '../stores/LocaleStore';

const styles = {
  banner: {
    height: 'auto',
    background: 'rgba(52, 64, 81, 0.88) url(/cookie.png) 20px 50% no-repeat',
    backgroundSize: '30px 30px',
    backgroundColor: '',
    position: 'fixed',
    bottom: 0,
  },
  button: {
    border: '1px solid white',
    borderRadius: 4,
    width: 66,
    height: 32,
    lineHeight: '32px',
    background: 'transparent',
    color: 'white',
    fontSize: '14px',
    fontWeight: 600,
    opacity: 1,
    right: 20,
    marginTop: -18,
  },
  message: {
    display: 'block',
    padding: '9px 67px',
    lineHeight: 1.3,
    textAlign: 'left',
    marginRight: 95,
    color: 'white',
  },
  link: {
    marginLeft: 0,
  },
};

@observer
class CookieBanner extends React.Component<InjectedIntlProps> {
  @lazyInject(LocaleStore)
  localeStore: LocaleStore;

  render(): React.ReactNode {
    const message = this.props.intl.formatMessage({
      id: 'cookie.banner.message',
    });

    const link = this.props.intl.formatMessage({
      id: 'cookie.banner.link',
    });

    return (
      <CookieBannerComponent
        dismissOnScroll={false}
        dismissOnClick={false}
        styles={styles}
        message={message}
        link={<a href='/documents/Privacy Policy.pdf' target='_blank'>{link}</a>}
        buttonMessage='OK'
        onAccept={() => null}
        cookie='user-has-accepted-cookies' />
    );
  }
}
export default injectIntl(CookieBanner) as React.ComponentClass<{}>;